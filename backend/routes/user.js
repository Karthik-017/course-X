const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const prisma = require("../prismaClient");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  await prisma.user.create({
    data: { email, password, firstName, lastName, phone },
  });
  res.json({ message: "user signup successful" });
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id }, JWT_USER_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: { course: true },
  });
  res.json({ purchases });
});



userRouter.get('/me', userMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});


userRouter.get("/:courseId", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const courseId = parseInt(req.params.courseId);

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            contents: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user purchased the course
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        courseId
      }
    });

    const isPurchased = !!purchase;

    // If not purchased, remove contents
    if (!isPurchased) {
      course.sections = course.sections.map(section => ({
        ...section,
        contents: []
      }));
    }

    res.json({ message: "Course found", course, isPurchased });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = { userRouter };
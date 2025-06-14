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
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});

userRouter.put('/me', userMiddleware, async (req, res) => {
  const { firstName, lastName, phone, bio, username, occupation } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName,
        lastName,
        phone,
        bio,
        username,
        occupation,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        bio: true,
        username: true,
        occupation: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});


// Route to change password (would need additional validation)
userRouter.put('/me/password', userMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: newPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


userRouter.get("/course/:courseId", userMiddleware, async (req, res) => {
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

// User Dashboard


userRouter.get("/dashboard", userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    // 1. Purchased Courses
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });
    const purchasedCourses = purchases.map(p => p.course);

    // 2. Active Courses (started but not completed)
    const activeCourses = await prisma.courseProgress.findMany({
      where: {
        userId,
        completed: false,
      },
      include: {
        course: true,
      },
    });

    // 3. Completed Courses
    const completedCourses = await prisma.courseProgress.findMany({
      where: {
        userId,
        completed: true,
      },
      include: {
        course: true,
      },
    });

    // 4. Course Progress
    const progressRecords = await prisma.courseProgress.findMany({
      where: { userId },
      include: { course: true },
    });

    const courseProgress = progressRecords.map(progress => ({
      courseId: progress.courseId,
      title: progress.course.title,
      completedPercentage: progress.completedPercentage,
    }));

    // 5. Recent Courses (latest 5, excluding already purchased)
    const recentCourses = await prisma.course.findMany({
      where: {
        NOT: {
          id: {
            in: purchasedCourses.map(c => c.id),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.json({
      purchasedCourses,
      activeCourses: activeCourses.map(p => p.course),
      completedCourses: completedCourses.map(p => p.course),
      courseProgress,
      recentCourses,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = { userRouter };
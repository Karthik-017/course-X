const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const prisma = require("../prismaClient");

const courseRouter = Router();

courseRouter.get("/preview", async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json({ message: "preview course", courses });
});

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.userId;
 const courseId = parseInt(req.body.courseId, 10); // Convert courseId to integer

  if (isNaN(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }



  // Check if the user already purchased this course
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (existingPurchase) {
    return res.status(400).json({ message: "Course already purchased" });
  }

  // Proceed to purchase if not already purchased
  await prisma.purchase.create({
    data: { userId, courseId },
  });

  res.json({ message: "Course purchased successfully" });
});


courseRouter.get("/:courseId", userMiddleware, async (req, res) => {
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



module.exports = { courseRouter };
const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const prisma = require("../prisma");

const courseRouter = Router();

courseRouter.get("/preview", async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json({ message: "preview course", courses });
});

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.body;

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


module.exports = { courseRouter };
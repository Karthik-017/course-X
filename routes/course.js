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
  await prisma.purchase.create({
    data: { userId, courseId },
  });
  res.json({ message: "Course purchased successfully" });
});

module.exports = { courseRouter };
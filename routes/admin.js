const { Router } = require("express");
const adminRouter = Router();
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  await prisma.admin.create({
    data: { email, password, firstName, lastName },
  });
  res.json({ message: "signup success" });
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({
    where: { email },
  });
  if (admin && admin.password === password) {
    const token = jwt.sign({ id: admin.id }, JWT_ADMIN_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price } = req.body;
  const course = await prisma.course.create({
    data: { title, description, imageUrl, price, creatorId: adminId },
  });
  res.json({ message: "course created", courseId: course.id });
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, description, imageUrl, price, courseId } = req.body;
  await prisma.course.update({
    where: { id: courseId },
    data: { title, description, imageUrl, price },
  });
  res.json({ message: "course updated", courseId });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courses = await prisma.course.findMany({
    where: { creatorId: adminId },
  });
  res.json({ message: "courses found", courses });
});

module.exports = { adminRouter };
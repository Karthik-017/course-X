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
  const adminId = req.userId; // Authenticated admin ID
  const { title, description, imageUrl, price, courseId } = req.body;

  try {
    // Check if course exists and belongs to this admin
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (course.creatorId !== adminId) {
      return res.status(403).json({ error: "Not authorized to edit this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { title, description, imageUrl, price },
    });

    res.json({ message: "Course updated successfully", course: updatedCourse });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const courses = await prisma.course.findMany({
    where: { creatorId: adminId },
  });
  res.json({ message: "courses found", courses });
});

module.exports = { adminRouter };
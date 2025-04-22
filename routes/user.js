const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const prisma = require("../prisma");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  await prisma.user.create({
    data: { email, password, firstName, lastName },
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

module.exports = { userRouter };
const { Router } = require("express");
const user = require("./user");
const { userMiddleware } = require("../middleware/user");
const { courseModel } = require("../db");
const {purchaseModel} = require("../db");

courseRouter = Router();

courseRouter.get("/preview", async (req, res) => {
  
  const courses = await courseModel.find({});


  
  res.json({
    message:"preview course",
    courses
  })
})




courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;
  
  await purchaseModel.create({
    userId,
    courseId
  });
  
  res.json({
    message:"Course purchased successfully"
  });
})

module.exports = {
  courseRouter : courseRouter
}
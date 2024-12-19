const { Router } = require("express");
const {userModel, purchaseModel, courseModel} = require("../db")
const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD} = require("../config")
const {userMiddleware} = require("../middleware/user")

// todo: hashing, 


const userRouter = Router();


userRouter.post('/signup', async function (req, res) {

  const {email, password, firstName, lastName} = req.body

  await userModel.create({
    email : email,
    password : password,
    firstName : firstName,
    lastName : lastName
  })


  res.json({
    message:"user signup successfull"
  })

 
})

userRouter.post('/signin', async (req, res) => {

  const {email, password} = req.body;

  const user = await userModel.findOne({
    email : email,
    password : password
  })
  
  
  if(user){
    const token = jwt.sign({
      id: user._id
    }, JWT_USER_PASSWORD);

    res.json({
      token: token
    })
  }else{
    res.status(403).json({
      message:"Incorrect credentials"
    })
  }
})

userRouter.get('/purchases', userMiddleware, async (req, res) => {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId
  });

  let purchasedCourseIds = [];

  for(let i=0; i<purchases.length; i++){
    purchasedCourseIds.push(purchases[i].courseId)
  }

 const couseData = await courseModel.find({
    _id: { $in: purchasedCourseIds }
  });



// map approch
  // const couseData = await courseModel.find({
  //   _id: { $in: purchases.map(x => x.courseId) }
  // });

  res.json({
    purchases,
    couseData
  })

})


module.exports = {
userRouter : userRouter
}
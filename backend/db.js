const mongoose = require("mongoose");

 const Schema = mongoose.Schema;

 const ObjectId = mongoose.ObjectId;

 const usersSchema = new Schema({
  firstName:String,
  lastName:String,
  password:String,
  email: {
    type: String,
    unique: true
  }
  
 })
 const adminSchema = new Schema({
  firstName:String,
  lastName:String,
  password:String,
  email: {
    type: String,
    unique: true
  }

 })
 const courseSchema = new Schema({
  title:String,
  description:String,
  price:Number,
  imageUrl: String,
  creatorId: ObjectId

 })
 const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId

 })


 const userModel = mongoose.model('users', usersSchema);
 const adminModel = mongoose.model('admins', adminSchema);
 const courseModel = mongoose.model('courses', courseSchema);
 const purchaseModel = mongoose.model('purchases', purchaseSchema);

 module.exports={
  userModel,
  adminModel,
  courseModel,
  purchaseModel
 }
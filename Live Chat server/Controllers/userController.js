const express=require("express");
const UserModel=require("../modals/userModel")
const asyncHandler= require("express-async-handler");
const generateToken=require("../Config/generateToken");

const loginController=asyncHandler(async(req,res)=>{
   const {name,password}=req.body;
   const user =await UserModel.findOne({name});

   if (!user) {
      res.status(401); // Unauthorized status
      throw new Error("User not found");
   }

   console.log("fetched User Data",user);
   console.log(await user.matchPassword(password))
   if(user && (await user.matchPassword(password))){
      const response= {
         _id:user._id,
         name:user.name,
         email:user.email,
         isAdmin:user.isAdmin,
         token:generateToken(user._id),
      };
      console.log(response);
      res.json(response);
      }
   else{
      throw new Error("Invalid Username or Password");
   }
});

const registerController=asyncHandler(async(req,res)=>{

 const {name,email,password}=req.body;

 // check for all fields
 if(!name || !email || !password)
    {
        res.send(400);
        throw new Error("All necessary input fields have not been filled")
    }

    //pre-existing user
    const userExist = await UserModel.findOne({email});
    if(userExist){
       res.status(400);
       throw new Error("User already Exists");
    }

    //userNme already taken
    const userNameExist = await UserModel.findOne({name});
    if(userNameExist)
    {  
       res.status(400);
       throw new Error("UserName already taken");
    }

    //create an entry in the db
    const user =await UserModel.create({name,email,password});
    if(user){
      res.status(201).json({
         _id:user._id,
         name:user.name,
         email:user.email,
         isAdmin:user.isAdmin,
         token:generateToken(user._id),
      });
    }
    else{
      res.status(400);
      throw new Error("Registration Error");
    }
});

const fetchALLUsersController= asyncHandler(async(req,res) =>{
   const keyword = req.query.search
   ? {
      $or:[
         {name:{$regex: req.query.search,$options:"i"}},
         {email:{$regex: req.query.search,$options:"i"}},
      ],
   }
   : {};
   const users = await UserModel.find(keyword).find({
      _id:{$ne:req.user._id},
   });
   res.send(users);
})

module.exports = {
   loginController,
   registerController,
   fetchALLUsersController};
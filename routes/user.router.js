const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();

const userRouter=express.Router();
const{Usermodel}=require("../models/user.model");
const {Authenticator}=require("../middlewares/authenticator.middleware");

userRouter.post("/register",async(req,res)=>{
    const{image,name,bio,phone,email,password}=req.body;
    try {
        const checker=await Usermodel.findOne({email});
        if(checker){
            res.status(202).json({"msg":"email is already registered, Please provide some other email Or login!"});
        }else{
            bcrypt.hash(password,7,async(err, hash)=>{
                if(hash){
                    const user=new Usermodel({image,name,bio,phone,email,password:hash});
                    await user.save();
                    res.status(200).json({"msg":"registration successful"});
                }else{
                    console.log(err.message);
                    res.status(404).json({"err":err.message});
                }
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Registration Failed","err":error.message});
    }
})

userRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await Usermodel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err, result)=>{
                if(result == true){
                    const token = jwt.sign({ userID:user._id },process.env.key);
                    res.status(200).json({"msg":"Login successful","token":token});
                }else{
                    res.status(404).json({"msg":"Wrong credentials, \n password is not matching, Please try again"});
                }
            });
        }else{
            res.status(404).json({"msg":"Wrong credentials,\n email is not matching, Please try again"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"login Failed","err":error.message});
    }
})


userRouter.get("/getProfile",Authenticator,async(req,res)=>{
    const userID=req.body.userID;
    try {
        const user=await Usermodel.findOne({_id:userID});
        if(user){
            res.status(200).json({"mag":"get profile successful","data":user});
        }else{
            res.status(404).json({"msg":"Unable to get the profile Data!"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"something went wrong with getting profile","err":error.message});
    }
})


userRouter.patch("/editProfile",Authenticator,async(req,res)=>{
    const id=req.body.userID;
    try {
        const uData=await Usermodel.findOne({_id:id});
        const image=req.body.image?req.body.image:uData.image;
        const bio=req.body.bio?req.body.bio:uData.bio;
        const name=req.body.name?req.body.name:uData.name;
        const phone=req.body.phone?req.body.phone:uData.phone;
        const email=req.body.email?req.body.email:uData.email;
        const password=req.body.password?req.body.password:uData.password;
        
        bcrypt.hash(password,7,async(err, hash)=>{
            if(hash){
                await Usermodel.findByIdAndUpdate({_id:id},{image,bio,name,phone,email,password:hash});
                res.status(200).json({"msg":"user profile details updated successfully"});
            }else{
                console.log(err.message);
                res.status(404).json({"msg":"something went wrong with editing profile,\n Please try again.","err":err.message});
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"something went wrong with editing profile,\n Please try again.","err":error.message});
    }
})


module.exports={
    userRouter
}
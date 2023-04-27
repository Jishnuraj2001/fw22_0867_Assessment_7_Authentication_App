const jwt=require("jsonwebtoken");
require("dotenv").config();

async function Authenticator(req,res,next){
    const token=req.headers.authorization;
    try {
        if(token){
            jwt.verify(token, process.env.key,(err, decoded)=>{
                if(decoded){
                    req.body.userID=decoded.userID;
                    next();
                }else{
                    res.status(404).json({"msg":"Authenication Failed!","err":err.message});
                }
              });
        }else{
            res.status(404).json({"msg":"Authenication Failed! Please login First"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Authenication Failed!","err":error.message});
    }
}

module.exports={
    Authenticator
}
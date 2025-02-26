let jwt=require('jsonwebtoken');
let User=require('../models/User')
require('dotenv').config();
let auth=async (req,res,next)=>{
    try{
        let tokon=req.cookies.jwt;
        let verifiedUser=jwt.verify(tokon,process.env.JWT_SECRET);
        // console.log(verifiedUser)
        let user=await User.findOne({_id:verifiedUser._id});
        req.tokon=tokon;
        req.AuthUser=user;
        req.Role=user.Role
        next();
    }
    catch(e){
        res.status(404).json({
            mess:"not verified user",
            success:false,
            error:true

        })
    }
}
module.exports=auth
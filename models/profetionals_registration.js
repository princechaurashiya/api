    const bcrypt = require('bcryptjs');
  require('../db/connections');  
  let vaildate=require('validator')
  let mongoose=require('mongoose')
   
  let Profasonal_Schema=new mongoose.Schema({
    Name:{
      type:String,
   
    },
    email:{
      type: String,
       unique:true,
      vaildate(value){
        if(!vaildate.isEmail(value)){
          throw new Error('enter valid email')
        }
      }
    },
    work:{
      type:String,
   
    }, experience:{
      type:String,
   
    }, img:{
      type:String,
   
    }, phoneNo:{
      type:String,
   
    }, serviceCharge:{
      type:String,
   
    }, aadhar:{
      type:String,
   
    }, pan:{
      type:String,
   
    }, 
    fees:{
      type:Number
    },
    Role:{
      type:String,

    },
    ratting:{
      type:Number
    }
  })
  
  let Profasonals=new mongoose.model('Profasonals',Profasonal_Schema);
  module.exports=Profasonals
const bcrypt = require('bcryptjs');
require('../db/connections'); // Import the connection pool
let vaildate=require('validator')
let mongoose=require('mongoose')
 
let UserSchema=new mongoose.Schema({
  name:{
    type:String,
     required:true

  },
  email:{
    type: String,
    required:true,
    unique:true,
    vaildate(value){
      if(!vaildate.isEmail(value)){
        throw new Error('enter valid email')
      }
    }
  },
  password:{
    type:String
  },
   
  Role:{
    type:String
  },
  phone:{
    type:String

  },
  address:{
    type:String

  }
})

let User=new mongoose.model('User',UserSchema);
module.exports=User
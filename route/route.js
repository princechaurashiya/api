let express=require('express');
let rout=express.Router();
require('../db/connections')
const bcrypt = require('bcryptjs');
let User=require('../models/User')
const jwt = require('jsonwebtoken');
let profesonal=require('../models/profetionals_registration');
let auth=require('../middleware/auth')
 // const proff = require('./models/profetionals_registration'); // Your user model

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
let cookie=require('cookie-parser')

rout.use(cookie())

// Status route
rout.get('/status', (req, res) => {
    res.status(200).json({ message: 'Server is running successfully!' });
  });
  
  // Register route
  rout.post('/register', async (req, res) => {
    const DATA = req.body; // Extract email and password from request body
  let payload={...DATA,Role:'General'}
    try {
        let ExisUser=await User.findOne({email:payload.email});
        if(payload.Cpassword){
        if ( payload.password!==payload.Cpassword){
            throw new Error('Enter same password');

                }
                 }
        if(ExisUser ){
            throw new Error('Already Loging user');
        }
let NewUser=new User(payload);
 let BcriptPass=await bcrypt.hash(payload.password,10)
 NewUser.password=BcriptPass
 
let Data=await  NewUser.save();

        res.status(201).json({ message: 'User registered successfully!',success:true,da:Data });
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        // Handle duplicate email error for MySQL
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  });
  
  // Login route
  rout.post('/login', async (req, res) => {
    const { email, password } = req.body;
      try {

   if(email==''|| password==''){
    throw new Error('Fill  Loign Properly')
   }
  
      // Find the user by email
      const user = await User.findOne({email:email});
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
     
     console.log(token);
      res.cookie('jwt',token,{expiresIn:'30d',httpOnly:true,secure:true})
      res.json({ message: 'Login successful', success:true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  });
  
  // to see  All login user 
  rout.get('/see-user',auth,async(req,res)=>{
try{
let data=await User.find();
res.json({
  status:200,
  success:true,
  error:false,
  data:data
})

}
catch(e){
  res.json({
    error:true,
    status:404,
    success:false,
    mess:e.massage,
  })
}
  })

   // to logout user 
   rout.delete('/Delete-user/:id',auth,async(req,res)=>{
    try{
let ID=req.params.id;

    let data=await User.findByIdAndDelete({_id:ID});
    res.json({
      status:200,
      success:true,
      error:false,
      data:data
    })
    
    }
    catch(e){
      res.json({
        error:true,
        status:404,
        success:false,
        mess:e.massage,
      })
    }
      })
  
// user edit
   rout.put('/Edit-user/:id',auth,async(req,res)=>{
    try{
let ID=req.params.id;
let payload=req.body;

    let data=await User.findByIdAndUpdate({_id:ID},payload,{new:true});
    res.json({
      status:200,
      success:true,
      error:false,
      data:data
    })
    
    }
    catch(e){
      res.json({
        error:true,
        status:404,
        success:false,
        mess:e.massage,
      })
    }
      })
  

// update user Password

rout.put('/update-user-password/:id',auth,async(req,res)=>{
  try{
let ID=req.params.id;
let payload=req.body;

if(payload.password!=payload.Cpassword){
throw new Error('enter same password');
}
payload.password=await bcrypt.hash(payload.password,10);

  let data=await User.findByIdAndUpdate({_id:ID},payload,{new:true});
  res.json({
    status:200,
    success:true,
    error:false,
    data:data
  })
  
  }
  catch(e){
    res.json({
      error:true,
      status:404,
      success:false,
      mess:e.massage,
    })
  }
    })

 
  // profesonal Registration
  rout.post('/proff_user',auth, async (req, res) => {
    let AuthUsers=req.AuthUser;
    // console.log(AuthUsers)
    const DATA = req.body; 
    let payload={...DATA,Role:'profesonal',ratting:0}
    console.log(payload)

     try {
        const ExistUser = await profesonal.findOne({email:AuthUsers.email});
if(ExistUser){
    throw new Error('Already Register user');

}
let ProffUser=new profesonal({...payload,Name:AuthUsers.name,email:AuthUsers.email,Role:'profesonal'});
      // Register the user using the User model
 await ProffUser.save();  
      res.status(201).json({ message: 'User registered successfully!' ,ProffUser});
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        // Handle duplicate email error for MySQL
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  });

    // profesonal Update detail
  rout.put('/edit-proff-user/:id',auth, async (req, res) => {
    let AuthUsers=req.AuthUser;
     let ID=req.params.id;
    // console.log(AuthUsers)
    const payload = req.body; 
    //  console.log(payload)
    

     try {
        const ExistUser = await profesonal.findOne({email:AuthUsers.email});
 if(!ExistUser){
    throw new Error('NOT Registerd user');

}
let ProffUser=await profesonal.findByIdAndUpdate({_id:ID},{...payload,Name:AuthUsers.name,email:AuthUsers.email},{new:true});
      // Register the user using the User model
       res.status(201).json({ message: 'User upadte successfully!' ,ProffUser});
    } catch (err) {
      // console.error(err);
         res.status(400).json({success:false ,error:true,mess: 'update not succes ' });
       
    }
  });  

  //delete profesonal Registration
rout.delete('/delete-proffDetail/:id',auth,async(req,res)=>{
  let AuthUsers=req.AuthUser;
  let ID=req.params.id;
   try {
      const ExistUser = await profesonal.findOne({email:AuthUsers.email});
if(!ExistUser){
  throw new Error('NOT Registerd user');

}
let ProffUser=await profesonal.findByIdAndDelete({_id:ID});
    // Register the user using the User model
     res.status(201).json({ message: 'User detail delete successfully!' ,ProffUser});
  } catch (err) {
    // console.error(err);
       res.status(400).json({success:false ,error:true,mess: 'User detail delete not success ' });
     
  }
})

// any one profesonal specific detail (for see general details)
rout.get('/specific-profesonal/:id',auth,async(req,res)=>{
  try{
 let ID=req.params.id;
  
  let data=await profesonal.findOne({_id:ID});
  res.json({
    status:200,
    success:true,
    error:false,
    data:data
  })
  
  }
  catch(e){
    res.json({
      error:true,
      status:404,
      success:false,
      mess:e.massage,
    })
  }
    })
 
// See all type of profesonal
rout.get('/All-profesonals',async(req,res)=>{
  try{
  let data=await profesonal.find();
  res.json({
    status:200,
    success:true,
    error:false,
    data:data
  })
  
  }
  catch(e){
    res.json({
      error:true,
      status:404,
      success:false,
      mess:e.massage,
    })
  }
    })
  

 //  profesonal work/catagory wise scarch
  rout.get('/proff-catgory/:work',async(req,res)=>{
    
     try {
      let work=req.params.work;
      let Work_detail = new RegExp(work, 'ig');
      console.log(Work_detail)
      let ProffUser=await profesonal.find({work:Work_detail});
      // Register the user using the User model
       res.status(201).json({ message: 'profesonal detail get successfully!' ,ProffUser});
    } catch (err) {
      // console.error(err);
         res.status(400).json({success:false ,error:true,mess: 'profesonal detail get not success ' });
       
    }
  })

//  profesonal work/catagory wise price sort low to high 
rout.get('/proff-catgory-price-low/:price',async(req,res)=>{
    
  try {
   let work=req.params.price;
   let Work_detail = new RegExp(work, 'ig');
   let ProffUser=await profesonal.find({work:Work_detail}).sort({fees:1});
   // Register the user using the User model
    res.status(201).json({ message: 'profesonal detail get successfully!' ,ProffUser});
 } catch (err) {
   // console.error(err);
      res.status(400).json({success:false ,error:true,mess: 'profesonal detail get not success ' });
    
 }
})

//  profesonal work/catagory wise price sort  high to low
rout.get('/proff-catgory-price-high/:price',async(req,res)=>{
    
  try {
   let work=req.params.work;
   let Work_detail = new RegExp(work, 'g');
   let ProffUser=await profesonal.find({work:Work_detail}).sort({fees:-1});
   // Register the user using the User model
    res.status(201).json({ message: 'profesonal detail get successfully!' ,ProffUser});
 } catch (err) {
   // console.error(err);
      res.status(400).json({success:false ,error:true,mess: 'profesonal detail get not success ' });
    
 }
})




  
module.exports =rout;
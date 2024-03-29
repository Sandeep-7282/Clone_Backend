/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The Email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         Photo:
 *           type: string
 *           description: The URL of the user's profile photo
 *           default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
 *         followers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: An array of user IDs representing followers
 *         following:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: An array of user IDs representing users being followed
 *         posts:
 *           type: array
 *           items:
 *             type: string
 *             description: ID of the user's posts
 *         saved:
 *           type: array
 *           items:
 *             type: string
 *             description: ID of the user's saved posts
 *         bio:
 *           type: string
 *           maxLength: 150
 *           description: User's biography
 *         Links:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user's links
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth-API]
 *     requestBody:
 *       description: User information to sign up
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             example:
 *               name: Test User
 *               username: user@123
 *               email: testuser1@gmail.com
 *               password: testing123
 *     responses:
 *       '200':
 *         description: Signup was Successful
 *       '500':
 *         description: Internal Server Error
 *       '401':
 *         description: Validation Errors
 *       '400':
 *         description: Duplication Errors
 *
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth-API]
 *     requestBody:
 *       description: User credentials for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       '200':
 *         description: Login successful
 *       '401':
 *         description: Validation Error
 *       '400':
 *         description: Inavlid Credentials
 *       '500':
 *         description: Internal Server Error
 *
 * /api/auth/forgotpassword:
 *   post:
 *     summary: Forgotpassword request
 *     tags: [Auth-API]
 *     requestBody:
 *       description: User email for forgotpassword request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *     responses:
 *       '200':
 *         description: OTP sent successfully
 *       '400':
 *         description: Unauthorized - Invalid Email entered
 *       '401':
 *         description: Validation Error
 *       '402':
 *         description: Error occured while sending OTP
 *       '500':
 *         description: Internal Server Error
 *
 * /api/auth/change-password-verification:
 *   post:
 *     summary: OTP verification for user to reset password
 *     tags: [Auth-API]
 *     requestBody:
 *       description: OTP to verify
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               otp:
 *                 type: string
 *                 description: The otp for verification
 *     responses:
 *       '200':
 *         description: OTP verification successful
 *       '400':
 *         description: Invalid OTP
 *       '500':
 *         description: Internal Server Error
 *
 * /api/auth/changepassword:
 *   post:
 *     summary: Change Password
 *     tags: [Auth-API]
 *     requestBody:
 *       description: New password to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       '200':
 *         description: Password Changed Successfully
 *       '401':
 *         description: Validation Error
 *       '400':
 *         description: No User Found
 *       '500':
 *         description: Internal Server Error
 */

const express=require('express');
require('dotenv').config();
const router=express.Router();
const User=require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Fetchuser=require('../middlewares/Fetchuser');
//var user_id='';
//var otpmail='';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  var otpMap = new Map();
router.post('/signup',[
    body('name','Enter valid name(characters more than 2)').isLength({ min: 3 }),
    body('username','Enter valid username(characters more than 2)').isLength({ min: 3 }),
     body('email','enter valid email id').isEmail(),
    body('password','password length must be greater than 4').isLength({ min: 4 }),
] ,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(401).send({ error:"Please Fill All Fields Properly",errors });
    }
    try{
        const saltRounds = 10;
        const salt=await bcrypt.genSalt(saltRounds);
        const securepassword=await bcrypt.hash(req.body.password,salt);
    let user=await User.findOne({email:req.body.email});
    if(user){
       return res.status(400).send({error:'email already exists'});
    }
    let user_name=await User.findOne({username:req.body.username});
    if(user_name){
       return res.status(400).send({error:'username already exists'});
    }
    user=await User.create({
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        password:securepassword
    })
    user_id=user.id
    const jwtdata={
        user:{
            id:user.id
        }
    }
  const authtoken=jwt.sign(jwtdata,process.env.PRIVATE_KEY);
  res.send({authtoken});
}
    catch(err){
        console.log(err.message)
        res.status(500).send({error:'Internal Server Error',err})
    }
})
router.post('/login', [
     body('email','enter valid email id').isEmail(),
    body('password','password cant be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).send({ error: "Please Fill in All Fields",errors });
    }
    try{
    const {email,password}=req.body;
    otpmail=email;
    let user=await User.findOne({email});
    if(!user){
       return res.status(400).send({error:'Invalid User'});
    }
const passwordcompare=await bcrypt.compare(password,user.password);
if(!passwordcompare){
    return res.status(400).send({error:'Invalid Login Credentials'});
}
/*//otp generation
const otp = generateOTP();
otpMap.set(email, otp);
const mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'Login OTP',
  text: `Your OTP for login is: ${otp}`,
};
transporter.sendMail(mailOptions, (error) => {
  let faildata={
    message:'Error in sending OTP',
    status:'fail',
    statuscode:'401'
  }
  if (error) {
    return res.json(faildata);
  }
  */
  const jwtdata={
    user:{
        id:user.id
    }
}
const authtoken=jwt.sign(jwtdata,process.env.PRIVATE_KEY);
  let data={
    message:'Login Success',
    status:'success',
    authtoken:authtoken,
    statuscode:'200'
  }
  return res.status(200).send(data);
}
catch(err){
        console.log(err.message)
        res.status(500).send({error:err.message,err})
    }
})
router.post('/forgotpassword',[
  body('email','enter valid email id').isEmail(),
], async (req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).send({ error: "Please Fill in All Fields",errors });
    }
         try{
          let user=await User.findOne({email:req.body.email});
          if(!user){
             return res.status(400).send({error:'Please Enter Valid Mail-Id'});
          }
      //otp generation
      const otp = generateOTP();
      otpMap.set(req.body.email, otp);
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'OTP To Reset Your Password',
        text: `Your OTP is: ${otp}`,
      };
      transporter.sendMail(mailOptions, (error) => {
        let faildata={
          message:'Error in sending OTP',
          status:'fail',
          statuscode:'402'
        }
        if (error) {
          return res.json(faildata);
        }
        let data={
          message:'OTP sent to your email',
          status:'success',
          statuscode:'200'
        }
        return res.send(data);
      });
         }
         catch(err){
          res.status(500).send({error:err.message,err})
         }
})
router.post('/changepassword'
,[
   body('email','enter valid email id').isEmail(),
  body('password','password length must be greater than 4').isLength({ min: 4 }),
], async (req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).send({ error: "Please Fill in All Fields",errors });
    }
  try{
   let user=await User.findOne({email:req.body.email});
   if(!user){
      return res.status(400).send({message:'No User Found'});
   }
   const saltRounds = 10;
   const salt=await bcrypt.genSalt(saltRounds);
   const securepassword=await bcrypt.hash(req.body.password,salt);
   console.log(securepassword)
    user.password=securepassword;
    console.log(user.password)
    await user.save();
    console.log("saved")
  return res.status(200).send({message:"password changed successfully"})
  }
  catch(err){
  return  res.status(500).send({message:err.message,err})
  }
})

router.post('/change-password-verification'
,[
   body('email','enter valid email id').isEmail(),
   body('otp','enter valid email id').isLength({min:6, max:6}),
], async (req, res) => {
  try {
    const {otp,email } = req.body;
    const storedOTP = otpMap.get(email);
    if ( storedOTP === parseInt(otp)) {
      return res.status(200).send({message:"OTP verification successfull"});
    }
   else{
      return res.status(400).send({message:"Invalid OTP"});
   }
  }
 catch (error) {
    let faildata={
      message:'Internal Server Error',
      data:{
        error:error.name
      },
      status:'fail',
      statuscode:'500'
    }
    return res.json(faildata);
  }
});
/*router.post('/login-otpverification', async (req, res) => {
    try {
      const {otp } = req.body;
      const storedOTP = otpMap.get(otpmail);
      let faildata={
        message:'Invalid OTP',
        data:{
          error:'OTP Verification Failed'
        },
        status:'fail',
        statuscode:'401'
      }
      if ( storedOTP === parseInt(otp)) {
        const user=await User.findOne({email:otpmail});
        if(!user){
          return res.status(400).send({message:"user not found"});
        }
        const jwtdata={
          user:{
              id:user.id
          }
      }
    const authtoken=jwt.sign(jwtdata,PRIVATE_KEY);
    return res.send({authtoken});
      }
     else{
        return res.status(400).send(faildata);
     }
    /*  let resdata={
        "message": "Logged In Successfully",
        "data": {
          "name": newUser.name,
          "username": newUser.username ,
          "email": newUser.email,
          "is_active": true,
          token:accessToken
        },
        "status": "success",
        statuscode:'200'
     } 
    } catch (error) {
      let faildata={
        message:'Internal Server Error',
        data:{
          error:error.name
        },
        status:'fail',
        statuscode:'500'
      }
      return res.json(faildata);
    }
  });
*/
  /*router.post('/googlesignup', async (req, res) => {
    try{
        const saltRounds = 10;
        const salt=await bcrypt.genSalt(saltRounds);
        const securepassword=await bcrypt.hash("Googleusers",salt);
    let user=await User.findOne({email:req.body.email});
    if(!user){
        user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:securepassword
        })
    }
    const jwtdata={
        user:{
            id:user.id
        }
    }
  const authtoken=jwt.sign(jwtdata,PRIVATE_KEY);
  res.send({authtoken});
}
    catch(err){
        console.log(err.message)
        res.status(500).send('Internal Server Error')
    }
})
*/
router.post('/getuser',Fetchuser,async (req,res)=>{
       try{
         id=req.user.id;
         const user=await User.findById(id).select('-password');
         res.status(200).send(user);
       }
       catch(error){
        res.status(500).send({error:error.message})
       }
})
module.exports = router;
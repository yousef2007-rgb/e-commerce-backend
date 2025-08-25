const express = require("express") 
const router = express.Router();
const _ = require("underscore")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const {User,Code,  signupSchema, signupSchemaWithCode} = require("../models/users.js");
const email = require("../email")
require("dotenv").config(); 

router.post("/",async (req, res, next) => {
    try{
        //pick just the values I need from the request body
        const requestBody = _.pick(req.body, ["name", "email", "password", "repeat_password", "number", "city", "address"])

        //validation using joi
        const {error} = signupSchemaWithCode.validate(req.body)
        if (error) {return res.status(400).send(error.details[0].message)}

        //checking if the user already exists
        const userCheck = await User.findOne({'email': requestBody.email});
        if(userCheck) {return res.status(400).send("this user already exists")}

        //verify code
        const codeToken = req.headers['x-code-token'];
        const codeId = await jwt.verify(codeToken, process.env.JWT_KEY)

        const minsPassed = ((Date.now()/1000) - codeId.iat) / 60;
        if(minsPassed > 2) {
            await Code.findByIdAndDelete(codeId._id);
            return res.status(408).send("this code timed out")
        }

        const code = await Code.findOne({_id: codeId})
        if(code.value != req.body.code) {
            await Code.findByIdAndDelete(codeId._id);
            return res.status(400).send("wrong code")
        }

        await Code.findByIdAndDelete(codeId._id);

        //hashing the password 
        const hashedPassword = await bcrypt.hash(requestBody.password, 15) 


        //creating the user
        const user = new User({...requestBody, password: hashedPassword});
        await user.save();

        
        //generating the jwt
        const token =await jwt.sign({_id: user._id,isAdmin: user.isAdmin }, process.env.JWT_KEY)
        res.send(token)
    }catch(err){
       next(err)         
    }
})

router.post("/code", async (req, res, next) => {
    try{

        //pick just the values I need from the request body
        const requestBody = _.pick(req.body, ["name", "email", "password", "repeat_password", "number", "city", "address"])

        //validation using joi
        const {error} = signupSchema.validate(requestBody)
        if (error) {return res.status(400).send(error.details[0].message)}

        //checking if the user already exists
        const userCheck = await User.findOne({'email': requestBody.email});
        if(userCheck) {return res.status(400).send("this user already exists")}
        //generate code and add it to the database
        const generatedCode =Math.floor( Math.random() * 1000000 ).toString().padStart(6,'0');  
        const code = new Code({value: generatedCode});
        await code.save()
        
        //sending the email
        const response = await email.send(`<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Two-Factor Authentication</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;padding:20px;margin:0;}.container{max-width:600px;margin:auto;background-color:#ffffff;padding:30px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);}h1{color:#333333;}p{color:#666666;}.code{background-color:#f0f0f0;padding:10px;border-radius:5px;font-size:24px;margin-bottom:20px;}.footer{text-align:center;margin-top:20px;color:#999999;}</style></head><body><div class="container"><h1>Two-Factor Authentication</h1><p>Dear User,</p><p>Your authentication code is:</p><div class="code">${code.value}</div><p>Please enter this code in the appropriate field to complete the authentication process.</p><p>If you did not request this code, please ignore this email.</p><p>Thank you,</p><p>KidzMarty</p><div class="footer">This is an automated email, please do not reply.</div></div></body></html>`, requestBody.email, 'Confirmation Email' )
        console.log(response)

        //creating a JWT with the code id
        const token = await jwt.sign({_id: code._id}, process.env.JWT_KEY);
        res.send(token)
    }catch(err){
        next(err)
    }

})

module.exports = router;  

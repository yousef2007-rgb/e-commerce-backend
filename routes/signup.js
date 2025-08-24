const express = require("express") 
const router = express.Router();
const _ = require("underscore")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const {User,  signupSchema} = require("../models/users.js");
require("dotenv").config(); 

router.post("/",async (req, res, next) => {
    try{
        //pick just the values I need from the request body
        const requestBody = _.pick(req.body, ["name", "email", "password", "repeat_password", "number", "city", "address"])

        //validation using joi
        const {error} = signupSchema.validate(requestBody)
        if (error) {return res.status(500).send(error.details[0].message)}

        //checking if the user already exists
        const userCheck = await User.findOne({'email': requestBody.email});
        if(userCheck) {return res.status(500).send("this user already exists")}
       
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

module.exports = router;  

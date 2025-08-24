const express = require("express")
const router = express.Router();
const _ = require("underscore");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const {signinSchema, User} = require("../models/users.js")

router.post("/",async (req, res, next ) => {
    try{
        const requestBody = _.pick(req.body, ['email', 'password']);

        //validate the request body
        const {error} =  signinSchema.validate(requestBody);
        if(error) {return res.status(400).send(error.details[0].message)}    

        //check if the user exists
        const user = await User.findOne({email: requestBody.email}); 
        if(!user) {return res.status(404).send("user doesn't exist")}

        //check if the password is right
        const passwordResut = await bcrypt.compare(requestBody.password, user.password) 
        if(!passwordResut) {return res.status(401).send("wrong password")}

        //generate a JWT containing user id and role 
        const token = await jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.JWT_KEY)
        
        res.send(token)


    }catch(err){
        next(err)
    }
});

module.exports = router;

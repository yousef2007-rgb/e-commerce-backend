const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Joi = require("joi")

const userSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required: true }, 
    number: {type:Number, required:true},
    address: {type:String, required:true},
    city: {type:String, required:true, default: "Amman",  
        enum: [
            "Amman",
            "Zarqa",
            "Irbid",
            "Russeifa",
            "Aqaba",
            "Madaba",
            "Mafraq",
            "Jerash",
            "Salt",
            "Karak",
            "Tafilah",
            "Ma'an",
            "Ajloun",
            "Jordan valley",
            "Deadsea"
    ]},
    isAdmin: {type: Boolean, default: false ,required:true}
})  

const codeSchema = new mongoose.Schema({
    value: {type: Number, required:true}
}) 


const User = mongoose.model("User", userSchema);
const Code = mongoose.model("Code", codeSchema);

const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.{8,100}$)(?! )(?!.* $)[\x20-\x7E]+$')).required(), 
    repeat_password: Joi.ref("password"),
    number: Joi.number().required(),
    address: Joi.string().required(),
    city: Joi.string().required().valid(
            "Amman",
            "Zarqa",
            "Irbid",
            "Russeifa",
            "Aqaba",
            "Madaba",
            "Mafraq",
            "Jerash",
            "Salt",
            "Karak",
            "Tafilah",
            "Ma'an",
            "Ajloun",
            "Jordan valley",
            "Deadsea"
    ),

})


const signupSchemaWithCode = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.{8,100}$)(?! )(?!.* $)[\x20-\x7E]+$')).required(), 
    repeat_password: Joi.ref("password"),
    number: Joi.number().required(),
    address: Joi.string().required(),
    city: Joi.string().required().valid(
            "Amman",
            "Zarqa",
            "Irbid",
            "Russeifa",
            "Aqaba",
            "Madaba",
            "Mafraq",
            "Jerash",
            "Salt",
            "Karak",
            "Tafilah",
            "Ma'an",
            "Ajloun",
            "Jordan valley",
            "Deadsea"
    ),
    code: Joi.string().required().min(6).max(6)

})


const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.{8,100}$)(?! )(?!.* $)[\x20-\x7E]+$')).required(), 
})


module.exports = {User:User,Code: Code, signinSchema: signinSchema, signupSchema:signupSchema , signupSchemaWithCode:signupSchemaWithCode} 

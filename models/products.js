const express = require("express");
const mongoose = require("mongoose");
const joi = require("joi");

const userSchema = new mongoose.Schema({
    title: {type: String, required: true },
    title_ar: {type: String, required: false },
    details: {type: String, required: false },
    details_ar: {type: String, required: false },
    price: {type: Number, required: true },
    listed_price: {type: Number, required: false },
    tags: {type: [String], required:false,},
    hidden: {type: Boolean, required: true , default: false},
    related: { type: [String], required: false },
    varients: { type: [mongoose.objectId], required: true}
}); 

const varientSchema = new mongoose.Schema({
    varient_title: {type: String, required: true },
    varient_title_ar: {type: String, required: false },
    image_url: {type: String, required: true},
    image_urls: {type: [String], required: false}.
    sku: {type: String, required:true},
    availability: {type: String,enum: ["in_stock", "out_of_stock", "comming_soon"], required: true , default: true},
    quantity: {type:Number, required: false, default: -1}, 
    hidden: {type: Boolean, required: true , default: false},
    dimensions: {type: String, required: false},
}); 

const User = mongoose.model("User", userSchema);
const Varient = mongoose.model("Varient", varientSchema);

const userValidation = joi.object({
    title: joi.string().required(),
    title_ar: joi.string(),
    details:joi.string(),
    details_ar: joi.string(),
    price: joi.number().required(),
    listed_price: joi.number(),
    tags: joi.array().items(joi.string()),
    hidden: joi.boolean(),
    related: joi.array().items(joi.string()), 
    varients: joi.array().items(joi.object({
        varient_title: joi.string().required(),
        varient_title_ar: joi.string(),
        image_url: joi.string(),
        image_urls:joi.array().items(joi.string()),
        sku:joi.string(),
        availability: joi.string().valid("in_stock", "out_of_stock", "comming_soon"),
        quantity: joi.number(),
        hidden: joi.boolean(),
        dimensions:joi.string(),
    })).required(), 
});

module.exports = {User, Varient, userValidation }

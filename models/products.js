const mongoose = require("mongoose");
const joi = require("joi");

const productSchema = new mongoose.Schema({
    title: {type: String, required: true },
    title_ar: {type: String, required: false },
    details: {type: String, required: false },
    details_ar: {type: String, required: false },
    price: {type: Number, required: true },
    listed_price: {type: Number, required: false },
    tags: {type: [String], required:false,},
    keywords: {type: [String], required:false,},
    hidden: {type: Boolean, required: true , default: false},
    related: { type: [String], required: false },
    varients_ids: { type: [mongoose.Schema.ObjectId], required: true},
    category_id: {type: mongoose.Schema.ObjectId, required: true}, 
    }); 

const varientSchema = new mongoose.Schema({
    varient_title: {type: String, required: true },
    varient_title_ar: {type: String, required: false },
    images_urls: {type: [String], required: false},
    sku: {type: String, required:true},
    availability: {type: String,enum: ["in_stock", "out_of_stock", "comming_soon"], required: true , default: "in_stock"},
    quantity: {type:Number, required: false, default: -1}, 
    hidden: {type: Boolean, required: true , default: false},
    dimensions: {type: String, required: false},
}); 

const Product = mongoose.model("Product", productSchema);
const Varient = mongoose.model("Varient", varientSchema);

const productValidationSchema = joi.object({
    title: joi.string().required(),
    title_ar: joi.string(),
    details:joi.string(),
    details_ar: joi.string(),
    price: joi.number().required(),
    listed_price: joi.number(),
    tags: joi.array().items(joi.string()),
    keywords: joi.array().items(joi.string()),
    hidden: joi.boolean(),
    related: joi.array().items(joi.string()), 
    varients_ids: joi.array().items(joi.object({
        id:joi.string(),
        varient_title: joi.string().required(),
        varient_title_ar: joi.string(),
        images_urls:joi.array().items(joi.string()).required(),
        sku:joi.string().required(),
        availability: joi.string().valid("in_stock", "out_of_stock", "comming_soon"),
        quantity: joi.number(),
        hidden: joi.boolean(),
        dimensions:joi.string(),
    })).required(), 
    category_id: joi.string().required(),
});

module.exports = {Product, Varient,  productValidationSchema}

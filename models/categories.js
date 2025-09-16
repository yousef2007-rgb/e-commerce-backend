const mongoose = require("mongoose"); 
const joi = require("joi");

const categorySchema = new mongoose.Schema({
    title: {type: String, required: true },
    title_ar: {type: String, required: false},
    details: {type: String, required: false},
    details_ar: {type: String, required: false},
    keywords: {type: [ String], required:false,},
    image_url: {type: String, required: false}
});

const Category = mongoose.model("category", categorySchema);

const categoryValidationSchema = joi.object({
    title: joi.string().required(),
    title_ar:joi.string(),
    details:joi.string(),
    details_ar:joi.string(),
    keywords: joi.array().items(joi.string()),
}); 

module.exports = {Category, categoryValidationSchema};



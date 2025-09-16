const express = require("express");  
const mongoose = require("mongoose");
const {Product, productValidationSchema} = require("../models/products.js");
//const {Category} = require("../models/categories.js");
const authMiddleware= require("../middleware/authorization.js");
const router = express.Router();
const _ = require("underscore");

router.get("/",  async (req, res ) =>  {
    const data = await Product.find();
    console.log(data)
    
});

router.post("/", authMiddleware, async (userData ,req, res) => {
    const reqBody = _.pick(req.body, ["title", "title_ar", 'details', 'details_ar', 'price', 'listed_price', 'tags', 'hidden', 'related', 'varients_ids', 'category_id']); 

    const {error} = productValidationSchema.validate(reqBody);
    if (error) { return res.status(400).send(error.details[0].message)}

//    const Category = 
});

module.exports = router;


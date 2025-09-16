const express = require("express");  
const {Category, categoryValidationSchema} = require("../models/categories.js");
const authMiddleware= require("../middleware/authorization.js");
const router = express.Router();
const multer = require("multer");
const _ = require("underscore");

const uploads = multer({dest:"uploads/"});

router.get("/",  async (req, res ) =>  {
    const data = await Category.find();
    console.log(data)
    res.send(data)
    
});

router.get("/:id",  async (req, res ) =>  {
    const data = await Category.findById(req.params.id);
    res.send(data)
    
});


router.post("/",uploads.single("image"),
    authMiddleware,
    async (
    req, res) => {
    try{
        const requestBody = _.pick(req.body, ["title", "title_ar", "details", "details_ar", "keywords" ])

        const {error} = categoryValidationSchema.validate(requestBody);
        if(error) return res.status(400).send(error.details[0].message);

        const category = new Category({
            ...requestBody,
            image_url: req.file.filename
        });

        await category.save();
        res.send(category._id);

    }catch(error) {
        console.log(error)
        return res.status(500).send(error);
    }


    
});

router.put("/:id",uploads.single("image"),authMiddleware,async (req, res) => {

    try{
        const requestBody = _.pick(req.body, ["title", "title_ar", "details", "details_ar", "keywords" ])

        const {error} = categoryValidationSchema.validate(requestBody);
        if(error) return res.status(400).send(error.details[0].message);

        const category = await Category.findByIdAndUpdate(req.params.id, {
            ...requestBody, image_url: req.file.filename
        });

        res.send(category)
    }catch(error) {
        console.log(error)
        return res.status(500).send(error);
    }
    

});


router.delete("/:id",authMiddleware,async (req, res) => {

    try{
        const category = await Category.findByIdAndDelete(req.params.id)
        res.send(`successfully deleted category: ${req.params.id}`);
    }catch(error) {
        console.log(error)
        return res.status(500).send(error);
    }
    

});


module.exports = router;



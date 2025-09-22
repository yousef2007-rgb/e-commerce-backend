const express = require("express");
const mongoose = require("mongoose");
const { Product, productValidationSchema, Varient } = require("../models/products.js");
const { Category } = require("../models/categories.js");
const authMiddleware = require("../middleware/authorization.js");
const multer = require("multer");
const router = express.Router();
const _ = require("underscore");

const uploads = multer({ dest: "uploads/" });


router.get("/", async (req, res) => {
    const data = await Product.find();
    res.send(data);
});


router.get("/:id", async (req, res) => {
    const data = await Product.findById(req.params.id);
    res.send(data);
});


router.get("/:id/varients/:varient_id", async (req, res) => {
    const data = await Varient.findById(req.params.varient_id);
    res.send(data);
});

router.post("/", uploads.array("images", 100), authMiddleware, async (req, res) => {
    const reqBody = _.pick(req.body, ["title", "title_ar", 'details', 'details_ar', 'price', 'listed_price', 'tags', 'keywords', 'hidden', 'related', 'varients_ids', 'category_id']);

    const { error } = productValidationSchema.validate(reqBody);
    if (error) { return res.status(400).send(error.details[0].message) }

    const category = await Category.findById(reqBody.category_id);
    if (!category) return res.status(400).send("category doesn't exits")

    const varients_array = reqBody.varients_ids;
    const varients_ids = []
    for (let i = 0; i < varients_array.length; i++) {
        const imageUrlsSet = new Set(varients_array[i].images_urls);
        const varient_images_urls = req.files
            .filter(obj => imageUrlsSet.has(obj.originalname)) // Filter objects whose 'originalname' is in the Set
            .map(obj => obj.filename)

        const varient_properties = _.pick(varients_array[i], ["varient_title", "varient_title_ar", "sku", "availability", "quantity", "hidden", "dimensions"]);
        const varient = new Varient({
            ...varient_properties, images_urls: varient_images_urls
        });

        await varient.save();
        varients_ids.push(varient._id);

    }

    const product = new Product({
        ...reqBody, varients_ids: varients_ids
    });

    await product.save();
    res.send(product);
});

router.put("/:id", uploads.array("images", 100), authMiddleware, async (req, res) => {
    const reqBody = _.pick(req.body, ["title", "title_ar", 'details', 'details_ar', 'price', 'listed_price', 'tags', 'keywords', 'hidden', 'related', 'varients_ids', 'category_id']);

    const { error } = productValidationSchema.validate(reqBody);
    if (error) { return res.status(400).send(error.details[0].message) }

    const category = await Category.findById(reqBody.category_id);
    if (!category) return res.status(400).send("category doesn't exits")

    const varients_array = reqBody.varients_ids;
    const varients_ids = []
    const oldProduct = await Product.findById(req.params.id);
    for (let i = 0; i < varients_array.length; i++) {
        const oldVarients = new Set(oldProduct.varients_ids);
        if (varients_array[i].id ) {
            const imageUrlsSet = new Set(varients_array[i].images_urls);
            const varient_images_urls = req.files
                .filter(obj => imageUrlsSet.has(obj.originalname)) // Filter objects whose 'originalname' is in the Set
                .map(obj => obj.filename)

            const varient_properties = _.pick(varients_array[i], ["varient_title", "varient_title_ar", "sku", "availability", "quantity", "hidden", "dimensions"]);

            const updatedVarient = await Varient.findByIdAndUpdate(varients_array[i].id, { ...varient_properties, images_urls: varient_images_urls });
            varients_ids.push(updatedVarient._id);
        } else {
            const imageUrlsSet = new Set(varients_array[i].images_urls);
            const varient_images_urls = req.files
                .filter(obj => imageUrlsSet.has(obj.originalname)) // Filter objects whose 'originalname' is in the Set
                .map(obj => obj.filename)

            const varient_properties = _.pick(varients_array[i], ["varient_title", "varient_title_ar", "sku", "availability", "quantity", "hidden", "dimensions"]);
            const varient = new Varient({
                ...varient_properties, images_urls: varient_images_urls
            });

            await varient.save();
            varients_ids.push(varient._id);
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...reqBody, varients_ids: varients_ids });
    res.send(updatedProduct);

})




router.delete("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.varients_ids.map(async (id, index) => {
        await Varient.findByIdAndDelete(id);
    });
    const data = await Product.findByIdAndDelete(req.params.id);
    res.send(data);
});


router.delete("/:id/varients/:varient_id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    const varient = await Varient.findById(req.params.varient_id);
    if (product.varients_ids.length > 1) {
        const data = await Varient.findByIdAndDelete(req.params.varient_id);
        const updatedVarientsIds = product.varients_ids.filter(id => {
            console.log(`Checking ID: ${id}, Is it equal to ${req.params.varient_id}? ${id != req.params.varient_id}`);
            return id != req.params.varient_id;
        });
        console.log(updatedVarientsIds)
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            varients_ids: updatedVarientsIds
        });
        res.send(data);
    } else {
        return res.status(400).send("a product should have at least 1 varient");
    }
});

module.exports = router;


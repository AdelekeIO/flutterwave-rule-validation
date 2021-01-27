const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../../middleware/authAndRole");

// Product Model
const Product = require("../../models/Product");

// @route   GET api/Product
// @desc    Get All Products
// @access  Private
router.get("/", auth, (req, res) => {
  Product.find()
    .sort({ date: -1 })
    .then(products =>
      res.json({
        msg: "All Products.",
        data: products
      })
    );
});

// @route   POST api/Product
// @desc    Post A Product
// @access  Private
router.post("/", auth, (req, res) => {
  let {
    categoryID,
    title,
    description,
    inStore,
    item_left,
    expiry_date
  } = req.body;
  if (
    !categoryID ||
    !title ||
    !description ||
    !inStore ||
    !item_left ||
    !expiry_date
  ) {
    res.status(404).json({ msg: "Kindly supply all fields." });
  }
  try {
    const newProduct = new Product({
      categoryID,
      added_by: req.user.id,
      title,
      description,
      inStore,
      item_left,
      expiry_date
    });

    newProduct.save().then(product =>
      res.json({
        status: true,
        data: product,
        msg: "Product added successfully."
      })
    );
  } catch (error) {
    res.json(404).json({ msg: "An error occured, please try again" });
  }
});

// @route   PUT api/product
// @desc    Edit A Product
// @access  Private
router.put("/:id", auth, (req, res) => {
  const { description, title, inStore } = req.body;
  // console.log(req.body);

  const updateProduct = {
    categoryID: req.body.categoryID,
    title: req.body.title,
    description: req.body.description,
    inStore: req.body.inStore,
    item_left: req.body.item_left,
    expiry_date: req.body.expiry_date,
    updated_by: req.user.id
  };

  // Simple validation
  if (!description || !title || !inStore) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  console.log(req.params.id);

  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Update By ID
    Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateProduct },
      { new: true }
    )
      .then(product => {
        res.json({
          msg: "Updated Successfully",
          product: product
        });
      })
      .catch(err => {
        console.log(err);
        res
          .status(404)
          .json({ success: "false", msg: "Cannot read property 'id' of null" });
      });
  } else {
    res.status(404).json({ success: "false", msg: "provide correct ID" });
  }
});

// @route   DELETE api/Product/:id
// @desc    Delete A Product
// @access  Private
router.delete("/:id", auth, (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Product.findById(req.params.id)
      .then(product => product.remove().then(() => res.json({ success: true })))
      .catch(err => res.status(404).json({ success: false }));
  } else {
    res.status(404).json({ msg: "Supply a valid ID", success: false });
  }
});

module.exports = router;

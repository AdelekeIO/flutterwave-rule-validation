const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../../middleware/authAndRole");

// ProductCategory Model
const ProductCategory = require("../../models/ProductCategory");

// @route   GET api/productCategory
// @desc    Get All Product categories
// @access  Private
router.get("/", auth, (req, res) => {
  ProductCategory.find()
    .sort({ date: -1 })
    .then(categories =>
      res.json({
        msg: "All Product Category.",
        data: categories
      })
    );
});

// @route   POST api/productCategory
// @desc    Post A Product
// @access  Private
router.post("/", auth, (req, res) => {
  const newProductCategory = new ProductCategory({
    added_by: req.user.id,
    title: req.body.title,
    desctiption: req.body.desctiption
  });

  newProductCategory.save().then(category =>
    res.json({
      status: true,
      data: category,
      msg: "Product Category added successfully."
    })
  );
});

router.put("/:id", auth, (req, res) => {
  const { desctiption, title } = req.body;
  // console.log(req.body);

  const updateCategory = {
    desctiption,
    title,
    updated_by: req.user.id
  };

  // Simple validation
  if (!desctiption || !title) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  //   console.log(updateCategory);

  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Update By ID
    ProductCategory.findByIdAndUpdate(
      req.params.id,
      { $set: updateCategory },
      { new: true }
    )
      .then(category => {
        res.json({
          msg: "Updated Successfully",
          category: {
            id: category.id,
            title: category.title,
            desctiption: category.desctiption
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.status(404).json({ success: "false", msg: "provide correct ID" });
  }
});

// @route   DELETE api/productCategory/:id
// @desc    Delete A ProductCategory
// @access  Private
router.delete("/:id", auth, (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    ProductCategory.findById(req.params.id)
      .then(message => message.remove().then(() => res.json({ success: true })))
      .catch(err => res.status(404).json({ success: false }));
  } else {
    res.status(404).json({ msg: "Supply a valid ID", success: false });
  }
});

module.exports = router;

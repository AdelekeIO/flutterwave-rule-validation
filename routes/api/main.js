const express = require("express");
const router = express.Router();

// @route   GET api/Product
// @desc    Get All Products
// @access  Public
router.get("/", (req, res) => {
  res.json("Welcome to sepermaket api v 0.1");
});

module.exports = router;

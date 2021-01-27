const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProductCategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  desctiption: {
    type: String,
    required: true
  },
  added_by: {
    type: String,
    required: true
  },
  updated_by: {
    type: String,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ProductCategory = mongoose.model(
  "productCategory",
  ProductCategorySchema
);

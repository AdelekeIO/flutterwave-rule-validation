const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
  categoryID: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  inStore: {
    type: Boolean,
    required: true
  },
  item_left: {
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
  expiry_date: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Product = mongoose.model("product", ProductSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
  senderId: {
    type: String,
    required: true
  },
  recieverId: {
    type: String,
    required: true
  },
  messageTitle: {
    type: String,
    required: true
  },
  messageBody: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  dateSeen: {
    type: Date,
    default: ""
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Item = mongoose.model("message", MessageSchema);

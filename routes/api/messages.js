const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../../middleware/authAndRole");

// Item Model
const Message = require("../../models/Message");

// @route   GET api/messages
// @desc    Get All messages
// @access  Private
router.get("/", auth, (req, res) => {
  Message.find()
    .sort({ date: -1 })
    .then(message => res.json(message));
});

// @route   GET api/messages/totalsent
// @desc    Get All messages
// @access  Private
router.get("/totalsent", auth, (req, res) => {
  Message.countDocuments(
    { senderId: req.user.id }, // filters
    function(error, resp) {
      //   if (error) throw error;
      res.json({
        status: true,
        data: resp,
        msg: "Total Message Sent."
      });
    }
  );
});

// @route   GET api/messages/recieved/:id
// @desc    Get Recieved messages
// @access  Private
router.get("/recieved/:id", auth, (req, res) => {
  try {
    // Fetch all users
    Message.find({ recieverId: req.params.id })
      .sort({ date: -1 })
      .then(messages =>
        res.status(200).json({
          msg: "All Recieved Messages.",
          data: { messages, total: messages.length }
        })
      );
  } catch (error) {
    console.log(error);
  }
});

// @route   GET api/messages/:id
// @desc    Get Sent messages
// @access  Private
router.get("/sent/:id", auth, (req, res) => {
  // Fetch all users
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      Message.find({ senderId: req.params.id })
        .sort({ date: -1 })
        .then(messages =>
          res.status(200).json({
            msg: "All Sent Messages.",
            data: { messages, total: messages.length }
          })
        );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(404).json({
      msg: "suplly a valid ID",
      status: false
    });
  }
});
// @route   POST api/messages
// @desc    Send A Message
// @access  Private
router.post("/", auth, (req, res) => {
  const newMessage = new Message({
    senderId: req.user.id,
    recieverId: req.body.recieverId,
    messageTitle: req.body.messageTitle,
    messageBody: req.body.messageBody
  });

  newMessage.save().then(message =>
    res.json({
      status: true,
      data: message,
      msg: "Message sent successfully."
    })
  );
});

// @route   DELETE api/items/:id
// @desc    Delete A Message
// @access  Private
router.delete("/:id", auth, (req, res) => {
  Message.findById(req.params.id)
    .then(message => message.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;

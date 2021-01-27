const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// mongoose.set("useFindAndModify", false);

// User Model
const User = require("../../models/User");
const auth = require("../../middleware/authAndRole");

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post("/", (req, res) => {
  const { name, email, password, role } = req.body;

  // Simple validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    // Check for existing user
    User.findOne({ email }).then(user => {
      if (user) return res.status(400).json({ msg: "User already exists" });
      // role.toLowerCase();
      // console.log(role);

      if (
        role.toLowerCase() != "supervisor" &&
        role.toLowerCase() != "employee" &&
        role.toLowerCase() != "client"
      ) {
        console.log(">>" + role);

        return res.status(400).json({
          msg: "Role must be one of 'Supervisor' , 'Employee', or 'Client'"
        });
      }
      const newUser = new User({
        name,
        email,
        password,
        role
      });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => {
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                  }
                });
              }
            );
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
});

// @route   DELETE api/user/:id
// @desc    Delete A User
// @access  Private
router.delete("/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

router.put("/:id", auth, (req, res) => {
  const { name, email, password, role } = req.body;
  // console.log(req.body);

  const updateUser = {
    name: name,
    email,
    password,
    role
  };

  // Simple validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  role.toLowerCase();
  console.log(role);

  if (role !== "supervisor" && role !== "employee" && role !== "client")
    return res.status(400).json({
      msg: "Role must be one of 'Supervisor' , 'Employee', or 'Client'"
    });
  console.log(updateUser);

  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(updateUser.password, salt, (err, hash) => {
        if (err) throw err;
        updateUser.password = hash;
        User.findByIdAndUpdate(
          req.params.id,
          { $set: updateUser },
          { new: true }
        )
          .then(user => {
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  msg: "Updated Successfully",
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                  }
                });
              }
            );
            // if (resp) {
            //   res.status(200).json({ success: true, data: resp });
            // } else {
            //   res.status(404).json({ success: false, msg: "no such user exist" });
            // }
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  } else {
    res.status(404).json({ success: "false", data: "provide correct ID" });
  }
});
// @route   GET api/users
// @desc    Fetch all users
// @access  Private
router.get("/", auth, (req, res) => {
  try {
    // Fetch all users
    User.find()
      .sort({ date: -1 })
      .then(users => res.status(200).json(users));
  } catch (error) {
    console.log(error);
  }
});

// @route   GET api/users/supervisor
// @desc    Fetch all supervisors
// @access  Private
router.get("/supervisors", auth, (req, res) => {
  try {
    // Fetch all users
    User.find({ role: "supervisor" })
      .sort({ date: -1 })
      .then(users =>
        res.status(200).json({ msg: "All supervisors.", data: users })
      );
  } catch (error) {
    console.log(error);
  }
});
// @route   GET api/users/clients
// @desc    Fetch all clients
// @access  Private
router.get("/clients", auth, (req, res) => {
  try {
    // Fetch all users
    User.find({ role: "client" })
      .sort({ date: -1 })
      .then(users =>
        res.status(200).json({ msg: "All clients.", data: users })
      );
  } catch (error) {
    console.log(error);
  }
});

// @route   GET api/users/employees
// @desc    Fetch all employees
// @access  Private
router.get("/employees", auth, (req, res) => {
  try {
    // Fetch all users
    User.find({ role: "employee" })
      .sort({ date: -1 })
      .then(users =>
        res.status(200).json({ msg: "All employees.", data: users })
      );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

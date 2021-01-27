const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token)
    return res.status(401).json({ msg: "No token, authorizaton denied" });

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // Add user from payload
    req.user = decoded;
    // console.log(decoded);

    try {
      User.find({ _id: mongoose.Types.ObjectId(decoded.id) }).then(user => {
        // console.log(user[0].role);
        if (user[0].role !== "supervisor") {
          res
            .status(401)
            .json({ msg: "You are not eligible to view this record." });
        }
      });
    } catch (error) {
      console.log(error);
    }
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;

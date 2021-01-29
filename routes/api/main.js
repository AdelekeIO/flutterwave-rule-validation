const express = require("express");
const config = require("config");
const router = express.Router();
var _ = require("lodash");
const me = config.get("myData");
let { conditionValidation, validate } = require("../../lib/utility");

// @route   GET /
// @desc    First route is the base route. HTTP GET "/"
// @access  Public
router.get("/", (req, res) => {
  let response = {
    message: "My Rule-Validation API",
    status: "success",
    data: me,
  };
  res.json(response);
});

// validate-rule
// @route   POST /
// @desc     Second route is the rule validation route. HTTP POST "/validate-rule""
// @access  Public
router.post("/validate-rule", async (req, res) => {
  try {
    let payload = req.body;

    let fb = await validate(payload);

    if (fb == true && _.isBoolean(fb)) {
      let data = await conditionValidation(payload);
      let { message, status, statusCode, ...updatedData } = data;

      let response = {
        message,
        status,
        data: {
          validation: updatedData,
        },
      };

      res.status(statusCode).json(response);
    } else {
      let response = {
        message: fb,
        status: "error",
        data: null,
      };
      res.status(400).json(response);
    }
  } catch (error) {
    console.log("/validate-rule ===>", error);
  }
});

module.exports = router;

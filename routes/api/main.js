const express = require("express");
const config = require("config");
const router = express.Router();
var _ = require("lodash");
const me = config.get("myData");
let struct = require("../../lib/constants.json");
let { conditionValidation, validate } = require("../../lib/utility");

// @route   GET /
// @desc    First route is the base route. HTTP GET "/"
// @access  Public
router.get("/", (req, res) => {
  struct.response.data = me;

  let response = struct.response;
  struct.response.message = "My Rule-Validation API";
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

      struct.response.data.validation = updatedData;
      struct.response.message = message;
      struct.response.status = status;
      let response = struct.response;
      res.status(statusCode).json(response);
    } else {
      struct.errorResponse.message = fb;
      let response = struct.errorResponse;
      res.status(400).json(response);
    }
  } catch (error) {
    console.log("/validate-rule ===>", error);
  }
});

module.exports = router;

const express = require("express");
const config = require("config");
const router = express.Router();
var _ = require("lodash");
const me = config.get("myData");
let struct = require("../../lib/constants.json");

// @route   GET /
// @desc    First route is the base route. HTTP GET "/"
// @access  Public
router.get("/", (req, res) => {
  struct.response.data = me;
  let response = struct.response;
  res.json(response);
});

// validate-rule
// @route   POST /
// @desc     Second route is the rule validation route. HTTP POST "/validate-rule""
// @access  Public
router.post("/validate-rule", async (req, res) => {
  let payload = req.body;
  let fb = await validate(payload);
  console.log({ fb });

  if (fb == true && _.isBoolean(fb)) {
    struct.response.data = me;
    let response = struct.response;
    res.json(response);
  } else {
    struct.errorResponse.message = fb;
    let response = struct.errorResponse;
    res.status(400).json(response);
  }
});

const validate = (payload) => {
  // Check if required field are supplied
  let resp = hasFields(struct.inputRequiredFields, payload);
  // console.log({ resp });

  if (resp == true && _.isBoolean(resp)) {
    // The rule field should be a valid JSON object and should contain the following required fields
    let { rule } = payload;
    let { rule: ruleData } = struct;
    console.log({ rule, ruleData });
    resp = _.isPlainObject(rule) ? true : ruleData.validJsonErrorMessage;

    // _.isPlainObject(rule) &&
    return resp;
  } else return resp;
};

const hasFields = (fields, payload) => {
  return fields.reduce((fb, v) => {
    if (!_.hasIn(payload, v.field)) {
      fb = v.message;
      return fb;
    } else return true;
  });
};

module.exports = router;

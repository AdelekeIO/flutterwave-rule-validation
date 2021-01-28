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

const validate = async (payload) => {
  // Check if required field are supplied
  let resp = await hasFields(struct.inputRequiredFields, payload);
  if (resp == true && _.isBoolean(resp)) {
    // The rule field should be a valid JSON object and should contain the following required fields
    let { rule, data } = payload;
    let { rule: ruleData } = struct;
    resp = _.isPlainObject(rule) ? true : ruleData.validJsonErrorMessage;
    // console.log({ resp1: resp });

    if (!_.isBoolean(resp)) return resp;
    // Validate Rules
    resp = await hasFields(ruleData, rule);
    // console.log({ resp2: resp });
    if (!_.isBoolean(resp)) return resp;

    // validate data alongside field
    let { field } = rule;
    resp = _.hasIn(data, field) ? true : field + " is required in data";

    // _.isPlainObject(rule) &&
    return resp;
  } else return resp;
};

const hasFields = async (fieldsParams, payload) => {
  let { fields, fieldRequired } = fieldsParams;
  // console.log({ fields });

  return await fields.reduce((fb, v, ci, a) => {
    if (_.hasIn(payload, v) == false || _.hasIn(payload, a[0]) == false) {
      fb = !_.hasIn(payload, v) ? v + fieldRequired : a[0] + fieldRequired;
      return fb;
    } else return true;
  });
};

module.exports = router;

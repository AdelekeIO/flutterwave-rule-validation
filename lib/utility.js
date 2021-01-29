var _ = require("lodash");
let struct = require("../lib/constants.json");

const hasFields = async (fieldsParams, payload) => {
  let { fields, fieldRequired } = fieldsParams;

  return await fields.reduce((fb, v, ci, a) => {
    if (_.hasIn(payload, v) == false || _.hasIn(payload, a[0]) == false) {
      fb = !_.hasIn(payload, v) ? v + fieldRequired : a[0] + fieldRequired;
      return fb;
    } else return true;
  });
};

exports.conditionValidation = async (payload) => {
  try {
    let { rule, data } = payload;
    let result = "";
    let { values: conditionsDefinition } = struct.condition;
    let { validation } = struct.dataSuccessPayloadResp;
    // data = await pruneIfArray(data);

    let { field, condition, condition_value } = rule;
    let nestedFields = _.split(field, ".", 2);

    let fieldDataValue =
      nestedFields.length > 1
        ? data[nestedFields[0]][nestedFields[1]]
        : data[field];

    switch (condition) {
      case conditionsDefinition[0]:
        result = _.eq(fieldDataValue, condition_value);
        break;
      case conditionsDefinition[1]:
        result = !_.eq(fieldDataValue, condition_value);
        break;
      case conditionsDefinition[2]:
        result = _.gt(fieldDataValue, condition_value);
        break;
      case conditionsDefinition[3]:
        result = _.gte(fieldDataValue, condition_value);
        break;
      case conditionsDefinition[4]:
        result = _.includes(fieldDataValue, condition_value);
        break;
      default:
        break;
    }
    validation.condition = condition;
    validation.condition_value = condition_value;
    validation.error = !result;
    validation.status = result ? "success" : "error";
    validation.statusCode = result ? 200 : 400;
    validation.field = field;
    validation.field_value = fieldDataValue;
    validation.message = result
      ? `field ${field} successfully validated.`
      : `field ${field} failed validation.`;

    return validation;
  } catch (error) {
    console.log("conditionValidation ==>", error);
  }
};

const pruneIfArray = (data) => {
  if (_.isString(data)) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log("error==>", error);
    }
  }
  if (
    typeof data == "object" &&
    !_.isPlainObject(data) &&
    data.length &&
    data.length > 0
  ) {
    data = data[0];
  }

  return data;
};

module.exports.validate = async (payload) => {
  try {
    // Check if required field are supplied
    let resp = await hasFields(struct.inputRequiredFields, payload);
    if (resp == true && _.isBoolean(resp)) {
      // The rule field should be a valid JSON object and should contain the following required fields
      let { rule, data } = payload;
      let { rule: ruleData } = struct;
      resp = _.isPlainObject(rule) ? true : ruleData.validJsonErrorMessage;

      if (!_.isBoolean(resp)) return resp;
      // Validate Rules
      resp = await hasFields(ruleData, rule);

      if (!_.isBoolean(resp)) return resp;

      // validate data alongside field
      let { field } = rule;

      // data = await pruneIfArray(data);

      resp = _.hasIn(data, field)
        ? true
        : `field ${field} is missing from data.`;

      if (!_.isBoolean(resp)) return resp;

      // Conditions
      let { values } = struct.condition;
      let { condition } = rule;
      resp = _.includes(values, condition)
        ? true
        : "A valid rule.condition is required.";
      if (!_.isBoolean(resp)) return resp;

      return resp;
    } else return resp;
  } catch (error) {
    console.log("validate ===> ", error);
  }
};

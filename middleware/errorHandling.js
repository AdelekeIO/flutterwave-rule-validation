var struct = require("../lib/constants.json");

module.exports.clientErrorHandler = (err, req, res, next) => {
  try {
    if (err.type && err.type == "entity.parse.failed") {
      let { errorResponse } = struct;
      errorResponse.message = "Invalid JSON payload passed.";
      console.error({ error: err.stack, errorResponse });
      res.status(400).send(errorResponse);
    } else next(err);
  } catch (error) {
    console.log("clientErrorHandler ===>", error);
  }
};

var struct = require("../lib/constants.json");

module.exports.clientErrorHandler = (err, req, res, next) => {
  if (err.type && err.type == "entity.parse.failed") {
    let { errorResponse } = struct;
    errorResponse.message = "Invalid JSON payload passed.";
    console.error({ error: err.stack, errorResponse });
    res.status(500).send(errorResponse);
  } else next(err);
};

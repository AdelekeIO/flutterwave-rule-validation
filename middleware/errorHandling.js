module.exports.clientErrorHandler = (err, req, res, next) => {
  try {
    if (err.type && err.type == "entity.parse.failed") {
      let errorResponse = {
        message: "Invalid JSON payload passed.",
        status: "error",
        data: null,
      };
      //   console.error({ error: err.stack, errorResponse });
      res.status(400).send(errorResponse);
    } else next(err);
  } catch (error) {
    //
    console.log("clientErrorHandler ===>", error);
  }
};

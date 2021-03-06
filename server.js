const express = require("express");
const app = express();
const { clientErrorHandler } = require("./middleware/errorHandling");
// Bodyparser Middleware
app.use(express.json());
app.use(clientErrorHandler);

// Use Routes
app.use("/", require("./routes/api/main"));
app.use("/validate-rule", require("./routes/api/main"));

// Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

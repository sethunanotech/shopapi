const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");

const productRoute = require("./api/routes/product");
const orderRoute = require("./api/routes/order");
const userRoute = require("./api/routes/user");

const dbConfig = require("./utils/config/dbconfig");

const dbUrl =
  "mongodb://" + dbConfig.host + ":" + dbConfig.port + "/" + dbConfig.db;

mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Database connection is successful");
  })
  .catch(error => {
    console.log("Error connecting database" + error);
    process.exit(1);
  });

const app = express();
const PORT = process.env.PORT || 3000;

//Logging mechanism
const logDirectory = path.join(__dirname, "log");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs("access.log", {
  interval: "1d",
  path: logDirectory
});

app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "No access to this resource"
  });
});

app.listen(PORT, () => {
  console.log("The server is started and listening on port : " + PORT);
});

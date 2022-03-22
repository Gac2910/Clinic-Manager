const express = require("express");
const app = express();
const path = require("path");
const port = 8888;

// set up body parser
const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

// set up morgan logger
const logger = require("morgan");
app.use(logger("dev"));

// allow CORS
const cors = require("cors");
app.use(cors());

// define full path of public folder
app.use(express.static(path.join(__dirname, 'public')));

// load .env file into process.env object
require("dotenv").config();

// routes
app.use("/", require("./routes/index"));
app.use("/index", require("./routes/index"));

// start listening
app.listen(port, () => {
    console.log("Listening On Port " + port);
});
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const auth = require("./routes/auth");

const app = express();
app.use(morgan("dev"));
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use("/auth", auth);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
    });
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});

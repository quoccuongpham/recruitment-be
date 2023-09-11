const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("../database/models/index");

const auth = require("./routes/auth");

const app = express();
app.use(morgan("dev"));
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    cors({ origin: true, credentials: true, exposedHeaders: ["set-cookie"] })
);
// routes
app.use("/auth", auth);

app.get("/", async (req, res) => {
    const user_type = await db.sequelize.model("user_type").findAll();
    console.dir(user_type);
    res.status(200).json({
        success: true,
        user_type,
    });
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});

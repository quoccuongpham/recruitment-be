const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("../database/models/index");

const auth = require("./routes/auth");
const employer = require("./routes/employer");
const employee = require("./routes/employee");

const app = express();
app.use(morgan("dev"));
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    cors({ origin: true, credentials: true, exposedHeaders: ["set-cookie"] })
);
// public
app.use("/public/upload/avatar", express.static("./public/upload/avatar"));

// routes
app.use("/auth", auth);
app.use("/employer", employer);
app.use("/employee", employee);

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

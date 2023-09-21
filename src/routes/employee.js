const router = require("express").Router();
const db = require("../../database/models/index");
const check_cookie = require("../middleware/check_cookie");
const controller = require("../controllers/employee.controller");

router.route("/jobs").get(controller.findAllJob);

module.exports = router;

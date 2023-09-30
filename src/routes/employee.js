const router = require("express").Router();

const check_cookie = require("../middleware/check_cookie");
const controller = require("../controllers/employee.controller");

router.route("/jobs").get(controller.findAllJob);
router.route("/job-detail/:id").get(controller.findJob);
router.route("/company").get(controller.findAllJob);

router.post("/apply", check_cookie, controller.applyJob);

router.route("/profile").get(check_cookie, controller.getProfile);

module.exports = router;

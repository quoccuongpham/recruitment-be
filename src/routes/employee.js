const router = require("express").Router();
const multer = require("multer");
const check_cookie = require("../middleware/check_cookie");
const controller = require("../controllers/employee.controller");
const db = require("../../database/models/index");

router.route("/jobs").get(controller.findAllJob);
router.route("/job-detail/:id").get(check_cookie, controller.findJob);
router.route("/company").get(controller.findAllJob);

router.post("/apply", check_cookie, controller.applyJob);

router.route("/profile").get(check_cookie, controller.getProfile);

const storage_avatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/upload/avatar");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload_avatar = multer({ storage: storage_avatar });

router.post(
    "/avatar",
    check_cookie,
    upload_avatar.single("avatar"),
    async function (req, res) {
        const user_info = req.user_info;
        const pathAvatar =
            `${process.env.HOST}/public/upload/avatar/` + req.file.filename;
        await db.sequelize.model("user_account").update(
            { user_image: pathAvatar },
            {
                where: {
                    id: user_info.id,
                },
            }
        );
        res.json({
            message: "upload file thành công",
            values: [req.file, req.body],
        });
    }
);
module.exports = router;

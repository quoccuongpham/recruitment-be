const router = require("express").Router();
const argon = require("argon2");
const db = require("../../database/models/index");
router.post("/login", (req, res) => {
    console.log(req.body);
    res.json({
        success: true,
    });
});

router.post("/register", async (req, res) => {
    const { user_type_id, email, password, contact_number } = req.body;
    const check_email = await db.sequelize
        .model("user_account")
        .findOne({ where: { email: email } });
    if (check_email === null) {
        try {
            const hash_password = await argon.hash(password);
            await db.sequelize.model("user_account").create({
                user_type_id,
                email,
                password: hash_password,
                contact_number,
            });
        } catch (error) {
            return res.json({
                success: false,
                message: "Error",
            });
        }
        return res.json({
            success: true,
            message: "register successfully",
        });
    } else {
        return res.json({
            success: false,
            message: "Email already exist",
        });
    }
});

// router.get("/account", async (req, res) => {
//     const user = await db.sequelize.model("user_account").findAll();
//     res.json({
//         user,
//     });
// });
module.exports = router;

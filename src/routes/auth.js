const router = require("express").Router();
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../../database/models/index");
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user_account = await db.sequelize
            .model("user_account")
            .findOne({ where: { email: email } });
        if (user_account !== null) {
            const check_password = await argon.verify(
                user_account.dataValues.password,
                password
            );
            if (check_password) {
                const token = jwt.sign(
                    { id: user_account.dataValues.id },
                    process.env.SECRET_JWT
                );
                res.cookie("token", token, {
                    signed: true,
                    maxAge: 1000 * 3600 * 24,
                    httpOnly: true,
                });
                return res.json({
                    success: true,
                    message: "login successfully",
                });
            } else {
                return res.json({
                    success: false,
                    message: "Wrong email or password",
                });
            }
        } else {
            return res.json({
                success: false,
                message: "Wrong email or password",
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Error",
        });
    }
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

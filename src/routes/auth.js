const router = require("express").Router();
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../../database/models/index");
const controller = require("../controllers/auth.controller");

const Response = require("../utils/Response");
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user_account = await db.sequelize
			.model("user_account")
			.findOne({ where: { email: email } });

		console.log(user_account);
		if (user_account !== null) {
			const check_password = await argon.verify(
				user_account.dataValues.password,
				password
			);
			if (check_password) {
				const token = jwt.sign(
					{
						id: user_account.dataValues.id,
						user_type_id: user_account.dataValues.user_type_id,
					},
					process.env.SECRET_JWT,
					{ expiresIn: 86400000 }
				);
				res.cookie("token", token, {
					signed: true,
					maxAge: 1000 * 3600 * 24,
					httpOnly: false,
				});
				return res.json({
					success: true,
					message: "login successfully",
					user_type_id: user_account.dataValues.user_type_id,
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

// get info user
router.get("/", async (req, res) => {
	if (!req.signedCookies.token) {
		return res.json(new Response(false));
	} else {
		try {
			const token = req.signedCookies.token;
			const { id } = jwt.verify(token, process.env.SECRET_JWT);
			const user_info = await db.sequelize
				.model("user_account")
				.findOne({ where: { id: id } });
			return res.json(
				new Response(true, "thanh conng", {
					email: user_info.dataValues.email,
					user_type_id: user_info.dataValues.user_type_id,
				})
			);
		} catch (error) {
			return res.json(new Response(false, "cookie khong con hieu luc"));
		}
	}
});

router.get("/logout", controller.logout);
module.exports = router;

const router = require("express").Router();
const db = require("../../database/models/index");
const jwt = require("jsonwebtoken");
const Response = require("../utils/Response");
const check_cookie = require("../middleware/check_cookie");
const controller = require("../controllers/employer.controller");

// create profile for company
router.post("/create", check_cookie, async (req, res) => {
	const {
		company_name,
		profile_description,
		establishment_date,
		company_website_url,
	} = req.body;
	const user_info = req.user_info;
	try {
		const Company = db.sequelize.model("company").build({
			company_name,
			profile_description,
			establishment_date,
			company_website_url,
			user_account_id: user_info.id,
		});
		await Company.save();
		res.json(new Response(true, "thanh cong"));
	} catch (error) {
		res.json(error);
	}
});

// push job
router.post("/create-job", check_cookie, async (req, res) => {
	const user_info = req.user_info;
	const {
		job_title,
		job_description,
		job_type_id,
		date_expire,
		country,
		state,
		city,
		street_address,
		zip,
	} = req.body;
	const format_date_expire = new Date(Number.parseInt(date_expire));

	const company_info = await db.sequelize.model("company").findOne({
		where: {
			user_account_id: user_info.id,
		},
	});
	const JobLocation = db.sequelize.model("job_location").build({
		country,
		state,
		city,
		zip,
		street_address,
	});
	const result_create_location = await JobLocation.save();
	const JobPost = db.sequelize.model("job_post").build({
		post_by_id: user_info.id,
		company_id: company_info.dataValues.id,
		job_title,
		job_description,
		job_location_id: result_create_location.dataValues.id,
		job_type_id,
		date_expire: format_date_expire,
	});
	await JobPost.save();
	res.json(new Response(true, "Create job post successfully!"));
});

// get job posted
router.get("/job-posted", check_cookie, async (req, res) => {
	const user_info = req.user_info;
	let job_posted = await db.sequelize.model("job_post").findAll({
		where: {
			post_by_id: user_info.id,
		},
	});
	return res.json(
		new Response(true, "Get job posted successfully", job_posted)
	);
});

router
	.route("/job-apply/:id")
	.get(check_cookie, controller.getApply)
	.post(check_cookie, controller.accept_job);

router.get("/seeker-profile/:id", check_cookie, controller.getSeekerProfile);
module.exports = router;

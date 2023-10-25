const db = require("../../database/models/index");
const initModels = require("../../database/models/init-models");
const { Op } = require("sequelize");
const mailer = require("../utils/mailer");
const mailTemplete = require("../utils/mailertemplete");
const JobActivityService = require("../service/JobActivity.service");
const SeekerProfileService = require("../service/SeekerProfile.service");

exports.findWorker = (req, res) => {
	res.json("findWorker");
};

// Lay danh sach nguoi dang ky ung tuyen
exports.getApply = async (req, res) => {
	try {
		const { user_info } = req;
		const job_post_id = req.params.id;
		// let apply = await db.sequelize
		// 	.models(["job_post_activity", "user_account"])
		// 	.findAll({
		// 		where: {
		// 			job_post_id: job_post_id,
		// 		},
		// 	});
		let apply = await db.sequelize.query(
			"SELECT id, contact_number, job_post_id, is_accept, email, user_image FROM job_post_activity AS jpa " +
				"INNER JOIN user_account AS ua ON jpa.user_account_id = ua.id " +
				"WHERE jpa.job_post_id = ?",
			{
				replacements: [job_post_id],
				type: db.sequelize.QueryTypes.SELECT,
			}
		);
		return res.json(apply);
		// let id_apply = apply.map((value) => {
		// 	return value.dataValues.user_account_id;
		// });
		// let user_apply = await db.sequelize.model("user_account").findAll({
		// 	attributes: ["id", "user_image", "email", "contact_number"],
		// 	where: {
		// 		id: {
		// 			[Op.in]: id_apply,
		// 		},
		// 	},
		// });
		// for (let i = 0; i < apply.length; i++) {
		// 	user_apply[i].dataValues.is_accept = apply[i].dataValues.is_accept;
		// }
		// return res.json(user_apply);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Da co loi xay ra" });
	}
};
// chap nhan don ung tuyen
exports.accept_job = async (req, res) => {
	const job_post_id = req.params.id;
	const { user_account_id, is_accept, email, interviewMessage } = req.body;
	console.log(
		job_post_id,
		user_account_id,
		is_accept,
		email,
		interviewMessage
	);
	try {
		const JobActivity = new JobActivityService(
			db.sequelize.model("job_post_activity")
		);
		await JobActivity.accept_job_apply(
			user_account_id,
			job_post_id,
			is_accept
		);
		mailer.sendMail(email, "testmail", mailTemplete(interviewMessage));
		return res.json({ success: true, message: "accept successfully!" });
	} catch (error) {
		console.log(error);
		return res.json({ success: false });
	}
};

exports.getSeekerProfile = async (req, res) => {
	try {
		const models = initModels(db.sequelize);
		const seeker_profile = new SeekerProfileService(
			models.seeker_profile,
			models.education_detail,
			models.experience_detail,
			models.user_account
		);
		const rs = await seeker_profile.get_profile_by_id(req.params.id);
		return res.json(rs);
	} catch (error) {
		console.log(error);
		return res.json("Da co loi xay ra");
	}
};

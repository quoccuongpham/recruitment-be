const db = require("../../database/models/index");
const initModels = require("../../database/models/init-models");
const JobActivityService = require("../service/JobActivity.service");

exports.findAllJob = async (req, res) => {
	try {
		const jobs = await db.sequelize.model("job_post").findAll();
		const get_company_promise = jobs.map((job) => {
			return db.sequelize.model("company").findOne({
				where: {
					id: job.dataValues.company_id,
				},
			});
		});

		Promise.all(get_company_promise).then((values) => {
			const company_name = values.map((company) => {
				return company.dataValues.company_name;
			});
			for (let i = 0; i < jobs.length; i++) {
				jobs[i].dataValues.company_name = company_name[i];
			}

			return res.json(jobs);
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal error",
		});
	}
};

exports.findJob = async (req, res) => {
	const job = await db.sequelize
		.model("job_post")
		.findOne({ where: { id: req.params.id } });
	const {
		id,
		company_id,
		job_type_id,
		job_location_id,
		date_expire,
		job_description,
		job_title,
	} = job.dataValues;
	const company = db.sequelize.model("company").findOne({
		where: {
			id: company_id,
		},
	});
	const apply_list = await db.sequelize.model("job_post_activity").findAll({
		where: {
			user_account_id: req.user_info.id,
			job_post_id: id,
		},
	});
	const job_type = db.sequelize
		.model("job_type")
		.findOne({ where: { id: job_type_id } });
	const location = db.sequelize.model("job_location").findOne({
		where: {
			id: job_location_id,
		},
	});
	Promise.all([company, job_type, location])
		.then((values) => {
			const [company, job_type, job_location] = values;
			const { company_name } = company.dataValues;
			const { street_address, city, state, country } =
				job_location.dataValues;
			const job_type_name = job_type.dataValues.job_type;
			const job_location_string = `${street_address}${
				state ? `, ${state}` : ``
			}, ${city}, ${country}`;

			return res.json({
				id,
				date_expire,
				job_description,
				job_title,
				company_name,
				job_type_name,
				job_location_string,
				isApply: apply_list.length !== 0,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				error: "internal error",
			});
		});
};

exports.findAllCompany = async (req, res) => {
	const company = await db.sequelize.model("company").findAll();
	res.json(company);
};

exports.getApplyJob = async (req, res) => {
	try {
		const models = initModels(db.sequelize);
		const JobActivity = new JobActivityService(models.job_post_activity);
		const jobs = await JobActivity.get_job_apply_by_user(req.user_info.id);
		return res.json(jobs);
	} catch (error) {
		console.log(error);
		return res.end();
	}
};

exports.applyJob = async (req, res) => {
	try {
		const user_info = req.user_info;
		const current_time = Date.now();
		const job_apply = db.sequelize.model("job_post_activity").build({
			user_account_id: user_info.id,
			job_post_id: req.body.id_job,
			apply_date: current_time,
		});
		await job_apply.save();
		return res.json({
			success: true,
			message: "apply job successfully",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal error",
		});
	}
};

exports.getProfile = async (req, res) => {
	const user_info = req.user_info;
	let seekerInfo = db.sequelize
		.model("seeker_profile")
		.findOne({ where: { user_account_id: user_info.id } });
	let educationInfo = db.sequelize
		.model("education_detail")
		.findAll({ where: { user_account_id: user_info.id } });
	let experienceInfo = db.sequelize
		.model("experience_detail")
		.findAll({ where: { user_account_id: user_info.id } });

	Promise.all([seekerInfo, educationInfo, experienceInfo])
		.then((values) => {
			return res.json([user_info, ...values]);
		})
		.catch((err) => {
			return res.json(err);
		});
};

exports.createProfile = async (req, res) => {
	try {
		const data = req.body;
		const user_info = req.user_info;
		const user_account = {
			date_of_birth: data.date_of_birth,
			gender: data.gender,
		};
		const seeker_profile = {
			first_name: data.first_name,
			last_name: data.last_name,
			current_salary: data.current_salary,
			is_annually_monthly: data.is_annually_monthly == "on" ? "Y" : "N",
			currency: data.currency == "on" ? "VND" : "Dolar",
		};
		let education = [];
		let experience = [];
		const temp = {
			first_name: "Pham",
			last_name: "Quoc Cuong",
			current_salary: "3000000",
			is_annually_monthly: "on",
			currency: "on",
			date_of_birth: "2002-02-17",
			gender: "M",
			cetificate_degree_name_0: "Kĩ sư",
			major_0: "Công nghệ thông tin",
			institute_university_name_0: "Cần Thơ University",
			starting_date_0: "2020-10-10",
			completion_date_0: "2024-10-10",
			cgpa_0: "3.9",
			percentage_0: "",
			company_name_0: "Axon",
			job_title_0: "Webdeveloper",
			is_current_job_0: "on",
			job_location_country_0: "Việt Nam",
			job_location_state_0: "",
			job_location_city_0: "Cần Thơ",
			start_date_0: "2023-08-12",
			end_date_0: "2023-09-12",
			experience_lenght: "1",
			education_lenght: "1",
		};
		for (let i = 0; i < Number.parseInt(data.education_lenght); i++) {
			let education_temp = {
				cetificate_degree_name: data[`cetificate_degree_name_${i}`],
				major: data[`major_${i}`],
				institute_university_name:
					data[`institute_university_name_${i}`],
				completion_date: data[`completion_date_${i}`],
				starting_date: data[`starting_date_${i}`],
				percentage: data[`percentage_${i}`],
				cgpa: data[`cgpa_${i}`],
			};
			education.push(education_temp);
		}
		for (let i = 0; i < Number.parseInt(data.experience_lenght); i++) {
			let experience_temp = {
				start_date: data[`start_date_${i}`],
				end_date: data[`end_date_${i}`],
				is_current_job: data[`is_current_job_${i}`] == "on" ? "Y" : "N",
				job_title: data[`job_title_${i}`],
				company_name: data[`company_name_${i}`],
				job_location_city: data[`job_location_city_${i}`],
				job_location_state: data[`job_location_state_${i}`],
				job_location_country: data[`job_location_country_${i}`],
				description: data[`description_${i}`],
			};
			experience.push(experience_temp);
		}
		education = education.map((value) => {
			return Object.fromEntries(
				Object.entries(value).filter(
					([_, v]) => v != null && v != undefined && v != ""
				)
			);
		});
		experience = experience.map((value) => {
			return Object.fromEntries(
				Object.entries(value).filter(
					([_, v]) => v != null && v != undefined && v != ""
				)
			);
		});

		// UPDATE DATA
		await db.sequelize.model("user_account").update(user_account, {
			where: {
				id: user_info.id,
			},
		});
		await db.sequelize.model("seeker_profile").update(seeker_profile, {
			where: {
				user_account_id: user_info.id,
			},
		});
		education.forEach((value) => {
			let list_keys = Object.keys(value);
			if (
				list_keys.includes("cetificate_degree_name") &&
				list_keys.includes("major")
			) {
				db.sequelize
					.model("education_detail")
					.findOne({
						where: {
							user_account_id: user_info.id,
							cetificate_degree_name:
								value.cetificate_degree_name,
							major: value.major,
						},
					})
					.then((rs) => {
						if (rs) {
							db.sequelize
								.model("education_detail")
								.update(value, {
									where: {
										user_account_id: user_info.id,
										cetificate_degree_name:
											value.cetificate_degree_name,
										major: value.major,
									},
								})
								.catch((err) => console.log(err));
						} else {
							db.sequelize
								.model("education_detail")
								.create({
									user_account_id: user_info.id,
									...value,
								})
								.catch((err) => console.log(err));
						}
					})
					.catch((err) => console.log(err));
			}
		});
		experience.forEach((value) => {
			let list_keys = Object.keys(value);
			if (
				list_keys.includes("start_date") &&
				list_keys.includes("end_date")
			) {
				db.sequelize
					.model("experience_detail")
					.findOne({
						where: {
							user_account_id: user_info.id,
							start_date: value.start_date,
							end_date: value.end_date,
						},
					})
					.then((rs) => {
						if (rs) {
							db.sequelize
								.model("education_detail")
								.update(value, {
									where: {
										user_account_id: user_info.id,
										start_date: value.start_date,
										end_date: value.end_date,
									},
								})
								.catch((err) => console.log(err));
						} else {
							db.sequelize
								.model("education_detail")
								.create({
									user_account_id: user_info.id,
									...value,
								})
								.catch((err) => console.log(err));
						}
					})
					.catch((err) => console.log(err));
			}
		});

		res.json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false });
	}
};

exports.uploadAvatar = async (req, res) => {
	try {
		// Đọc tệp hình ảnh đã tải lên
		const imageFile = fs.readFileSync(req.file.path);

		// Chuyển đổi tệp hình ảnh thành dạng dữ liệu nhị phân
		const imageBinaryData = Buffer.from(imageFile).toString("base64");

		// Lưu dữ liệu nhị phân vào cơ sở dữ liệu PostgreSQL
		const values = [req.file.originalname, imageBinaryData];

		res.status(200).json({
			message: "Hình ảnh đã được tải lên và lưu vào cơ sở dữ liệu.",
			values,
		});
	} catch (error) {
		console.error("Lỗi:", error);
		res.status(500).json({ error: "Đã có lỗi xảy ra khi xử lý hình ảnh." });
	}
};

class SeekerProfile {
	constructor(
		seeker_model,
		education_model,
		experience_model,
		user_account_model
	) {
		this.Seeker = seeker_model;
		this.Education = education_model;
		this.Experience = experience_model;
		this.Account = user_account_model;
	}

	async get_profile_by_id(id) {
		const rs = await this.Seeker.findOne({
			where: {
				user_account_id: id,
			},
			include: [
				{
					model: this.Education,
					as: "education_details",
				},
				{
					model: this.Experience,
					as: "experience_details",
				},
				{
					model: this.Account,
					as: "user_account",
					attributes: [
						"email",
						"date_of_birth",
						"gender",
						"contact_number",
						"user_image",
					],
				},
			],
		});
		return rs;
	}
}

module.exports = SeekerProfile;

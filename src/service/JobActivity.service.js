class JobActivityService {
	constructor(job_activity_model) {
		this.JobActivity = job_activity_model;
	}

	async accept_job_apply(user_account_id, job_post_id, is_accept) {
		await this.JobActivity.update(
			{ is_accept: Boolean(is_accept) },
			{
				where: {
					user_account_id,
					job_post_id,
				},
			}
		);
	}

	async get_job_apply_by_user(id) {
		return await this.JobActivity.findAll({
			where: {
				user_account_id: id,
			},
			include: "job_post",
		});
	}
}

module.exports = JobActivityService;

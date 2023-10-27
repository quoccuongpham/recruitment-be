class CompanyService {
	constructor(models) {
		this.Company = models?.CompanyModel;
		this.CompanyImage = models?.CompanyImageModel;
	}

	async getCompanyInfoByUserAccount(id) {
		return await this.Company.findOne({
			where: {
				id: id,
			},
			include: [
				{
					model: this.CompanyImage,
					as: "company_images",
					attributes: [["company_image", "url"]],
				},
			],
		});
	}

	async createOrUpdateCompanyProfile(id, data) {
		try {
			const company = this.Company.findOne({
				where: {
					user_account_id: id,
				},
			});
		} catch (error) {}
	}
}

module.exports = CompanyService;

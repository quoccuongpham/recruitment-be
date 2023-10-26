class CompanyService {
	constructor(models) {
		this.Company = models?.CompanyModel;
		this.CompanyImage = models?.CompanyImageModel;
	}

	async getCompanyInfoByUserAccount(id) {
		return await this.Company.findOne({
			where: {
				user_account_id: id,
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
}

module.exports = CompanyService;

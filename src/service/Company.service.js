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
			const companyInfo = await this.getCompanyInfoByUserAccount(id);
			console.table(companyInfo, ["dataValues"]);
			if (companyInfo) {
				// update
				console.log("update");
				return companyInfo;
			} else {
				// tao moi
				return "tao moi";
			}
		} catch (error) {
			console.log(error);
			return {};
		}
	}
}

module.exports = CompanyService;

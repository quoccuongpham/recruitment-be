const db = require("../../database/models/index");
const { Op } = require("sequelize");
exports.findWorker = (req, res) => {
    res.json("findWorker");
};

// Lay danh sach nguoi dang ky ung tuyen
exports.getApply = async (req, res) => {
    try {
        const { user_info } = req;
        const job_post_id = req.params.id;
        let apply = await db.sequelize
            .model("job_post_activity")
            .findAll({ where: { job_post_id } });
        apply = apply.map((value) => {
            return value.dataValues.user_account_id;
        });
        let user_apply = await db.sequelize.model("user_account").findAll({
            attributes: ["user_image", "email", "contact_number"],
            where: {
                id: {
                    [Op.in]: apply,
                },
            },
        });
        return res.json(user_apply);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Da co loi xay ra" });
    }
};

const db = require("../../database/models/index");
exports.findAllJob = async (req, res) => {
    const jobs = await db.sequelize.model("job_post").findAll();
    res.json(jobs);
};

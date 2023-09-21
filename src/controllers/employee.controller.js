const db = require("../../database/models/index");
exports.findAllJob = async (req, res) => {
    const jobs = await db.sequelize.model("job_post").findAll();
    res.json(jobs);
};

exports.findJob = async (req, res) => {
    const job = await db.sequelize
        .model("job_post")
        .findOne({ where: { id: req.params.id } });
    res.json(job);
};

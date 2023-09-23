const db = require("../../database/models/index");
exports.findAllJob = async (req, res) => {
    const jobs = await db.sequelize.model("job_post").findAll();
    res.json(jobs);
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
}
const router = require("express").Router();
const db = require("../../database/models/index");
const jwt = require("jsonwebtoken");
const Response = require("../utils/Response");
const check_cookie = require("../middleware/check_cookie");

// create profile for company
router.post("/create", check_cookie, async (req, res) => {
    const {
        company_name,
        profile_description,
        establishment_date,
        company_website_url,
    } = req.body;
    const user_info = req.user_info;
    try {
        const Company = db.sequelize.model("company").build({
            company_name,
            profile_description,
            establishment_date,
            company_website_url,
            user_account_id: user_info.id
        });
        await Company.save();
        res.json(new Response(true, "thanh cong"));
    } catch (error) {
        res.json(error);
    }
});

// push job
router.post("/create-job", check_cookie, async (req, res) => {
    // @param: { post_by_id, job_type_id, company_id, is_company_name_hidden, job_description, job_location_id, is_active }

})

module.exports = router;

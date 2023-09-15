const jwt = require("jsonwebtoken");
const db = require("../../database/models/index");
const Response = require("../utils/Response");

module.exports = async function check_cookie(req, res, next) {
    try {
        const token = req.signedCookies.token;
        const { id } = jwt.verify(token, process.env.SECRET_JWT);
        const user_info = await db.sequelize.model("user_account").findByPk(id);
        if (!user_info) {
            return res.json(new Response(false, "invalid user"));
        }
        req.user_info = user_info.dataValues;
        next();
    } catch (error) {
        return res.json(new Response(false, "error", { error }));
    }
};

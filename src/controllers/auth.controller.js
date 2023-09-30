exports.logout = function (req, res) {
    res.clearCookie("token");
    res.end();
}
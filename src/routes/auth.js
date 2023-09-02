const router = require("express").Router();

router.post("/login", (req, res) => {
    console.log(req.body);
    res.json({
        success: true,
    });
});

module.exports = router;

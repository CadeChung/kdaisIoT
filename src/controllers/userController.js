let getPageDashboard = async (req, res) => {
    return res.render("user_templates/user.ejs", {
        user: req.user
    });
};

module.exports = {
    getPageDashboard: getPageDashboard,
};
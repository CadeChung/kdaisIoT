let getPageLogin = (req, res) => {
    res.render("login.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getPageLogin: getPageLogin
};
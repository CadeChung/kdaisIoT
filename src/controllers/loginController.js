let getPageLogin = (req, res) => {
    return res.render("auth/login.ejs", {
        errors: req.flash("errors")
    });
};

let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
}

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

let postLogOut = (req, res) => {
    req.session.destroy((err) => {
        return res.redirect("/login");
    });
};

module.exports = {
    getPageLogin: getPageLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};
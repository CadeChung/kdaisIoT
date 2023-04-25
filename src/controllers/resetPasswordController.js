let getPageResetpassword = async(req, res) => {
    return res.render("resetpassword.ejs",{
        errors: req.flash("errors"),
        email: "",
        token: "",
    });
};

let handleResetPassword = async (req, res) => {
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/reset");
    }

    try {
        //await resetPasswordService.handleLogin(req.body.email, req.body.token);
        return res.redirect("/reset");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/reset");
    }
};

module.exports = {
    getPageResetpassword: getPageResetpassword,
    handleResetPassword: handleResetPassword,
}
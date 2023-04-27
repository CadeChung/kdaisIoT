const { validationResult } = require('express-validator');
const forgotpasswordService = require("../services/forgotpasswordService");

let getPageResetpassword = async(req, res) => {

    if (req.query.token && req.query.email) {
        // 在路由處理程序中設置 session
        req.session.email = req.query.email;
        req.session.token = req.query.token;      
    } 
    const {token, email} = req.session;

    // 假設驗證失敗，回傳 404 狀態碼並顯示 404 頁面
    if (!email || !token) {
        return res.status(404).render("404.ejs");
    }

    return res.render("resetpassword.ejs",{
        errors: req.flash("errors"),
        token: token,
        email: email,
    });
};

let handleResetPassword = async (req, res) => {
    try {
        const newPassword = req.body.newPassword;
        const {token, email} = req.session;
        const currentTime = new Date(Date.now());

        let validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            let errors = Object.values(validationErrors.mapped()).map(item => item.msg);
            req.flash("errors", errors);
            return res.render("resetpassword.ejs", {
                errors: req.flash("errors"), 
                token: token, 
                email: email,
            });
        }

        await forgotpasswordService.handleResetPassword(newPassword, token, email, currentTime);
        res.locals.isSent = true;
        return res.render("resetpassword.ejs", {
            errors: req.flash("errors"), 
            token: token, 
            email: email,
        });

    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/reset");
    }
};

module.exports = {
    getPageResetpassword: getPageResetpassword,
    handleResetPassword: handleResetPassword,
}
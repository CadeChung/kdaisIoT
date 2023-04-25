const { validationResult } = require('express-validator');
const forgotpasswordService = require("../services/forgotpasswordService");
const crypto = require("crypto");

let getPageForgetPassword = async(req, res) => {
    return res.render("forgotpassword.ejs", {
        errors: req.flash("errors")
    });
};

let handleForgotPassword = async(req, res, next) => {
    //驗證請求的區域
    let errorsArr = [];
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/forgotpassword");
    }

    try {
        const email = req.body.email;
        const origin = req.header('Origin');
        const resetToken = crypto.randomBytes(40).toString('hex')
        const resetTokenExpires = new Date(Date.now() + 60*60*1000);
        const createdAt = new Date(Date.now());
        const expiredAt = resetTokenExpires;
        // 驗證Email是否存在
        await forgotpasswordService.handleForgotPassword(
            origin,
            email, 
            resetToken, 
            createdAt, 
            expiredAt, 0);
        
        res.locals.isSent = true;
        return res.render("forgotpassword.ejs", {errors: req.flash("errors")});

    } catch (err) {
        console.log(err)
        req.flash("errors", err)
        return res.redirect("/forgotpassword");
    }
};


module.exports = {
    getPageForgetPassword : getPageForgetPassword,
    handleForgotPassword: handleForgotPassword,
}
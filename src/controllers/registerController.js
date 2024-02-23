const registerService = require('../services/registerService');
const { validationResult } = require('express-validator');

let getPageRegister = (req, res) => {
    return res.render("auth/register.ejs", {
        errors: req.flash("errors")
    });
};

let createUser = async (req, res) => {
    //驗證請求的區域
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/register");
    }

    // 新增使用者到MySQL
    try {
        let newUser = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        };

        await registerService.createUser(newUser);
        res.locals.isSent = true;
        return res.render("auth/register",{
            errors: req.flash("errors")
        });
    } catch (err) {
        req.flash("errors", err)
        return res.redirect("/register");
    }

};

module.exports = {
    getPageRegister : getPageRegister,
    createUser : createUser
}
const registerService = require('../services/registerService');
const { validationResult } = require('express-validator');
const auth = require("../validation/authValidation");

let getPageRegister = (req, res) => {
    res.render("register.ejs")
};

let createUser = (req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorArr.push(item.msg);
        });
        req.flash("errors", errorArr);
        return res.redirect("/register")
    }
    console.log(req.body)
};

module.exports = {
    getPageRegister : getPageRegister,
    createUser : createUser
}
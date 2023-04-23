const { check } = require ("express-validator");

let validateRegister = [
    check ("email", "無效的Email").isEmail().trim(),

    check ("password", "密碼無效，必須符合4-12個字母數字")
    .isLength({ min: 4, 
                max: 12}),

    check("passwordConfirmation", "密碼與確認密碼並不一致，請重新嘗試")
    .custom((value, {req}) => {
        return value === req.body.password
    })
]

module.exports = {
    validateRegister : validateRegister
}
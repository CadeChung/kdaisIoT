const { check } = require("express-validator");

let validateRegister = [
    check("email", "無效的Email").isEmail().trim(),

    check("password", "密碼至少需要8個位元的字母與數字")
    .isLength({ min: 8}),

    check("passwordConfirmation", "密碼與確認密碼並不一致，請重新嘗試")
    .custom((value, { req }) => {
        return value === req.body.password
    })
];

let validateLogin = [
    check("email", "無效的email").isEmail().trim(),
    
    check("password", "無效的密碼")
    .not().isEmpty()

];

let validateForgotPassword = [
    check("email", "無效的Email").isEmail().trim(),
]

module.exports = {
    validateRegister: validateRegister,
    validateLogin: validateLogin,
    validateForgotPassword: validateForgotPassword,
}
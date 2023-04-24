const forgotpassword = require("./controllers/forgotPasswordController");
const forgotpasswordService = require("./services/forgotpasswordService");

tokenItem = {
    email : 'x78451212@gmail.com',
    tokenValue: 'fasdsadi2i3j13izc1rDSAD',
    createdAt: '202304241502',
    expiredAt: '202304241602',
    used: 0,
}

forgotpasswordService.insertResetToken(tokenItem.email, tokenItem.tokenValue, tokenItem.createdAt, tokenItem.expiredAt, tokenItem.used)
console.log(forgotpassword.handleForgotPassword);
require('dotenv').config();

const emailData = () => ({
    email_user : process.env.EMAIL_USER,
    email_pass : process.env.EMAIL_FORM_PASSWORD,
    email_form : process.env.EMAIL_FORM,
})

console.log(emailData()); // 輸出 emaildata 物件的值

module.exports = emailData;
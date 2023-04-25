require('dotenv').config();

const emaildata = () => ({
    email_form : process.env.EMAIL_FORM,
    user : process.env.USER,
    pass : process.env.EMAIL_FORM_PASSWORD,
})

module.exports = emaildata;
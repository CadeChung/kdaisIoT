const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const EmailSetting = require("../configs/EmailSetting");
const forgotpasswordService = require("../services/forgotpasswordService");

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
        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 60*60*1000);
        const createdAt = new Date(Date.now());
        const expiredAt = resetTokenExpires;
        console.log(origin)
        // 驗證Email是否存在
        await forgotpasswordService.handleForgotPassword(email);

        await forgotpasswordService.expireOldTokens(email, 1);
    
        // 傳入新的Token到MySQL
        await forgotpasswordService.insertResetToken(email, resetToken, createdAt, expiredAt, 0);
        // 寄送Email
        await sendPasswordResetEmail(email, resetToken, origin);
        res.json({ message: 'Please check your email for a new password' });
        res.locals.isSent = true;
        return res.render("forgotpassword.ejs", {errors: req.flash("errors")}); 

    } catch (err) {
        req.flash("errors", err)
        return res.redirect("/forgotpassword");
    }
};

let sendEmail = async (from, to, subject, html) => {
    // 寄送Email
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: EmailSetting.user,
        pass: EmailSetting.pass,
    },
    });

    await transporter.sendMail({from, to, subject, html})
    .then (info => {
      console.log({ info })
    }).catch(console.error);
    
}

const sendPasswordResetEmail = async (email, resetToken, origin) => {
  let message;

  if (origin) {
    const resetUrl = `${origin}/forgotpassword/resetPassword?token=${resetToken} email=${email}`;
    message = `<p>請點擊以下連結並重置密碼，此連結有效期為1小時：</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
    message = `<p>請使用以下token與 <code>/forgotpassword/reset-password</code> api 路由重置你的密碼：</p>
               <p><code>${resetToken}</code></p>`;
  }

  await sendEmail ({
    from: EmailSetting.email_form,
    to: email,
    subject: "重設你的密碼",
    html: `<h4>重設密碼</h4>
           ${message}`
  })
};


module.exports = {
    getPageForgetPassword : getPageForgetPassword,
    handleForgotPassword: handleForgotPassword,
    sendEmail: sendEmail,
    sendPasswordResetEmail, sendPasswordResetEmail,
}
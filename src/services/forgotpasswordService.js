const DBConnection = require("../configs/DBConnection");
const nodemailer = require('nodemailer');
const emaildata = require('../configs/emailData');

let handleForgotPassword = (origin, email, resetToken, createdAt, expiredAt, used) => {
    return new Promise (async (resolve, reject) => {
        // 檢查Email是否存在
        let user = await findUserByEmail(email);
        if (user) {
            await expireOldTokens(email, 1);
            await insertResetToken(email, resetToken, createdAt, expiredAt, used);
            await sendPasswordResetEmail(email, resetToken, origin);
            resolve(true)
        } else {
            reject(`該使用者Email "${email}" 不存在，請重新輸入`)
        }
    });
};

let findUserByEmail = (email) => {
    return new Promise ((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ? ', email,
                (err, rows) => {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0]
                    resolve(user)
                }
            )
        } catch (err) {
            reject(err)
        }
    });
};

let insertResetToken  = (email, tokenValue, createdAt, expiredAt, used) => {
    return new Promise((resolve, rejects) => {
        DBConnection.query(
            ' INSERT INTO `ResetPasswordToken` (`email`, `Token_value`, `created_at`, `expired_at`, `used`) VALUES (?, ?, ?, ?, ?)', [email, tokenValue, createdAt, expiredAt, used], (error, result)=> {
                if (error) {
                    return rejects(error);
                } 
                return resolve(result.insertId)
        });
    });
};

let expireOldTokens = (email, used) => {
    return new Promise ((resolve, reject) => {
        DBConnection.query(
            ' UPDATE `ResetPasswordToken` SET used= ? WHERE email = ? ', [used, email], (error) => {
            if (error) {
                return reject(error)
            }
            return resolve();
        });
    });
};

let sendEmail = async (from, to, subject, html) => {
    // 寄送Email
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        user: emaildata().user,
        pass: emaildata().pass,
    },
    });
    await transporter.sendMail({from, to, subject, html})
    .then (info => {
      console.log({ info })
    })
    .catch(console.error);
}

const sendPasswordResetEmail = async (email, resetToken, origin) => {
    let message;
  
    if (origin) {
      const resetUrl = `${origin}/forgotpassword/resetPassword?token=${resetToken}&email=${email}`;
      message = 
      `
        <p style="font-weight: bold; font-size: 18px; text-align: center;">請點擊以下連結並重置密碼，此連結有效期為1小時：</p>
        <div style="text-align: center; margin-top: 20px;">
            <a href="${resetUrl}" style="font-weight: bold; font-size: 16px; display: inline-block; background-color: #0167ff; color: rgb(255, 255, 255); padding: 10px 20px; border-radius: 5px; text-decoration: none;">重設密碼</a>
        </div>
        <p style="font-weight: bold; font-size: 18px; text-align: center; margin-top: 10px;">如果您沒有執行此操作的任何記憶，<br>請忽略此電子郵件，您的密碼將保持不變。</p>
        
        <div style="font-size: 14px; text-align: center; margin-top: 20px;">
            <a href="https://www.kdais.gov.tw/ws.php?id=1806">隱私權保護宣告</a> | 
            <a href="https://www.kdais.gov.tw/ws.php?id=1807">資訊安全政策宣告</a> | 
            <a href="https://kdais.ptmetas.com">文心蘭物聯網平台</a> |
        </div>
        <div style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
            © 2023 版權所有 kdais All Rights Reserved - 行政院農業委員會高雄區農業改良場<br>
            908126屏東縣長治鄉德和村德和路2-6號
        </div>
      `
    } else {
      message = `<p>請使用以下token與 <code>/forgotpassword/reset-password</code> api 路由重置你的密碼：</p>
      <p><code>${resetToken}</code></p>`;
    }

    await sendEmail (emaildata().email_form, email, `文心蘭物聯網平台密碼重設`, 
    `
    <div style="max-width: 650px; margin: 0 auto; background-color: #F0F2F5; padding: 20px; border-radius: 10px; font-family: Microsoft JhengHei;">
        <div style="background-color: floralwhite; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px #CFCFCF;">
            <div style="padding: 10px; background-color: lightgoldenrodyellow; border-radius: 10px; max-width: 500px; margin: 0 auto;">
                <h1 style="color: black; text-align: center;">重設您的密碼</h1>
            </div>
            ${message}
        </div>  
    </div>
    `
    )
};

module.exports = {
    findUserByEmail: findUserByEmail,
    handleForgotPassword: handleForgotPassword,
    insertResetToken: insertResetToken,
    expireOldTokens, expireOldTokens,
    sendEmail: sendEmail,
    sendPasswordResetEmail, sendPasswordResetEmail,
}
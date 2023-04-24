const DBConnection = require("../configs/DBConnection");

let handleForgotPassword = (email) => {
    return new Promise (async (resolve, reject) => {
        // 檢查Email是否存在
        let user = await findUserByEmail(email);
        if (user) {
            resolve(true)
        } else {
            reject(`該使用者Email "${email}" 不存在，請重新輸入`)
        }
    });
};

let insertResetToken  = (email, tokenValue, createdAt, expiredAt, used) => {
    return new Promise((resolve, rejects) => {
        DBConnection.query(
            'INSERT INTO `resetpasswordtoken` (email, Token_value, created_at, expired_at, used) VALUES (?, ?, ?, ?, ?)', [email, tokenValue, createdAt, expiredAt, used], (error, result)=> {
                if (error) {
                    return rejects(error);
                } 
                return resolve(result.insertId)
        });
    });
};

let expireOldTokens = (email) => {
    return new Promise ((resolve, reject) => {
        DBConnection.query(
            ' UPDATE `resetpasswordtoken` SET = ? WHERE email = ? ', [used, email], (error) => {
                if (error) {
                    return reject(error)
                }
                return resolve();
        });
    });
};

let findUserByEmail = (email) => {
    return new Promise ((resolve, reject) => {
        try {
            DBConnection.query(
                " SELECT * FROM `users` WHERE `email` = ?", email,
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

module.exports = {
    findUserByEmail: findUserByEmail,
    handleForgotPassword: handleForgotPassword,
    insertResetToken: insertResetToken,
    expireOldTokens, expireOldTokens
}
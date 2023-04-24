const DBConnection = require("../configs/DBConnection");
const bcrypt = require("bcrypt");

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        // 檢查Email是否存在
        let user = await findUserByEmail(email);
        if (user) {
            // 比較密碼是否一樣
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if(isMatch) {
                    resolve(true);
                } else {
                    reject(`你輸入的密碼不正確，請重新嘗試`);
                }
            });
        } else {
            reject(`該使用者的Email "${email}" 不存在`);
        }
    })
}

let findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ? ', email,
                (err, rows) => {
                    if (err) {
                        reject(err)
                    } 
                    let user = rows[0];
                    resolve(user)
                }
            );
        } catch (err) {
            reject(err)
        }
    });
};

let findUserById = (id) => {
    return new Promise ((resolve, reject) => {
        try {
            DBConnection.query (
                ' SELECT * FROM `users` WHERE `id` = ? ', id,
                (err, rows) => {
                    if (err) {
                        reject(err)
                    } 
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, userObject) => {
    return new Promise (async (resolve, reject) => {
        try{
            await bcrypt.compare(password, userObject.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`你輸入的密碼不正確，請重新嘗試`);
                }
            });
        } catch (err) {
            reject (err)
        }
    });
};

module.exports = {
    handleLogin: handleLogin,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword,
}
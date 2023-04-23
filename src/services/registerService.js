const DBConnection = require('../configs/DBConnection');
const bcrypt = require('bcryptjs');

let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // 檢查email是否存在
        let isEmailExist = await checkExistEmail(data.email);

        if (isEmailExist) {
            reject(`此Email "${data.email}" 已經存在，請重新輸入`);
        } else {
            // 加密密碼
            let salt = bcrypt.genSaltSync(10);
            let userItem = {
                username: data.userName,
                email: data.email,
                password: bcrypt.hashSync(data.password, salt),
            };

            // 建立新的使用者
            DBConnection.query(
            ' INSERT INTO users set? ' , userItem,
            (err, rows) => {
                if(err) {
                    reject(false)
                }
                    resolve("建立使用者成功!")
                }
            );
        };
    })
}

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            DBConnection.query(
                'SELECT * FROM `users` WHERE `email` =?', email,
                (err, rows) => {
                    if (err) {
                        reject(err)
                    }
                    if (rows.length > 0){
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            )
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createUser: createUser
}
const DBConnection = require("../configs/DBConnection");
const bcrypt = require("bcrypt");

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `email` = ? ', 
                [email],
                (err, rows) => {
                    if (err) {
                        reject(err);
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

const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `id` = ? ', 
                [id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!rows || rows.length === 0) {
                        reject(new Error(`找不到使用者`));
                        return;
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

const comparePassword = async (inputPassswd, hashPasswd) => {
    try {
        const isMatch = await bcrypt.compare(inputPassswd, hashPasswd);
        if (isMatch) {
            return true;
        } else {
            return (`你輸入的密碼不相符，請重新嘗試`);
        }
    } catch (err) {
        throw new Error(`密碼比較錯誤${err.message}`);
    }
}

module.exports = {
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword,
}
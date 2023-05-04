const DBConnection = require("../configs/DBConnection");

// 使用email查詢使用者的權限
let getUserRole = (email) => {
    return new Promise ((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT role FROM users WHERE email = ? ', email,
                ( err, rows ) => {
                    if (err) {
                        reject(err)
                    } 
                    let user = rows[0]
                    resolve(user)
                }
            )
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getUserRole : getUserRole,
}
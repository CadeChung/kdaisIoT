const DBConnection = require('../configs/DBConnection');

// const User = require('../configs/DBsequelize');

// 使用email查詢使用者的權限
// let getUserRole = (email) => {
//     return new Promise ((resolve, reject) => {
//         try {
//             User.findOne({
//                 attributes: ['role'],
//                 where: {
//                     email: email
//                 }
//             }) .then ((user) => {
//                 resolve(user);
//             }) .catch((err) => {
//                 reject(err);
//             })
//         } catch (err) {
//             reject(err)
//         }
//     })
// }

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
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    getUserRole : getUserRole,
}
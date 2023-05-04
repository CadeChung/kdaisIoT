const mysql = require('mysql2');
const bcrypt = require('bcrypt');

try {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Kdais@123',
        database: 'kdais_db'
    });
    
    connection.connect((err)=>{
        if (err) throw err;
        console.log("資料庫已連接")
    });
    
    let username = 'user123';
    let email = 'user@user.com';
    let password = 'user@123';
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let createUser = `INSERT INTO Users (username, email, password, role) VALUES ('${username}', '${email}', '${hash}', 'user')`;

    const findUser = connection.query(
        'SELECT * FROM users WHERE email = ?', 
        [email], (error, rows) => {
        if(error) {
            console.error(error);
        } else {
            let user = rows[0];
            console.log(user)
        }
    })

    connection.query(createUser, (error, result) => {
        if(error) {
            console.error(error);
        } else {
            console.log("建立使用者成功")
        }
    })
    connection.end()
    
} catch (error) {
    console.error('資料庫錯誤', error)
}

const mysql = require('mysql2');
const bcrypt = require('bcrypt');

try {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Kdais@123',
        database: 'kdais_db'
    });

    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL server');
        let username = 'admin';
        let email = 'x78451212@gmail.com';
        let password = 'Kdais@123';
        let role = 'admin'
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        let createUser = `INSERT INTO Users (username, email, password, role) VALUES ('${username}', '${email}', '${hash}', '${role}')`;

        const findUser = connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email], (err, rows) => {
                if (err) {
                    console.log(err);
                } else {
                    let user = rows[0];
                    console.log(user)
                }
            })

        connection.query(createUser, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("建立使用者成功")
            }
        })
        connection.end()
    });

} catch (err) {
    console.log('資料庫錯誤', err)
}
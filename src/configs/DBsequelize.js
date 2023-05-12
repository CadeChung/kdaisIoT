require('dotenv').config(); // 載入並讀取 .env 檔案中的環境變數

// 引入 sequelize 套件
const { Sequelize, DataTypes } = require('sequelize');

// 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
const DBsequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            decimalNumbers: true,
        },
        define: {
            timestamps: false,
        },
        logging: false,
});

// 使用 .authenticate() 方法檢查連線是否成功
DBsequelize.authenticate()
    .then(() => {
        console.log('資料庫連線成功');
    })
    .catch((error) => {
        console.error('資料庫連線錯誤:', error);
    });

const User = DBsequelize.define('users', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'user'
    },
    create_time: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
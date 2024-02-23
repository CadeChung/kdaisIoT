require('dotenv').config();
const fs = require("fs").promises;
const fetch = require('node-fetch');
const axios = require('axios');
const bcrypt = require('bcrypt');
const DBConnection = require('../configs/DBConnection');

const getCookieValue = async(cookieString, cookieName) => {
    const cookies = cookieString.split(';');
    for (let i =0; i< cookies.length; i++ ) {
        const cookie = cookies[i].trim();
        if(cookie.startsWith(`${cookieName}=`)) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
};

const changePassword = async (token, currentPasswd, newPasswd) => {
    try {
        const sectrtKey = process.env.SECRET_CODE;
        const cookie = await getCookieValue(token, 'myCookie');
        const decode = jwt.verify(cookie, sectrtKey);
        const userEmail = decode.email;
        const userPasswd = await findPassword(userEmail);
        const isPasswdValid = await bcrypt.compare(currentPasswd, userPasswd);
        if (isPasswdValid) {
            let salt = bcrypt.genSaltSync(10);
            const hashNewPasswd = bcrypt.hashSync(newPasswd, salt);
            await updatePasswd(userEmail, hashNewPasswd);
            console.log(`密碼更改成功`);
            return {success: true, message: '密碼更改成功'};
        } else {
            console.log(`舊密碼不相符`);
            return {success: false, message: '舊密碼不相符，請重新嘗試一次'};
        }
    } catch (err) {
        console.error(err);
        return {success: fasle, message: `伺服器錯誤`};
    }
};

const updatePasswd = (email, newPasswd) => {
    return new Promise (async(resolve, reject) => {
        try { 
            DBConnection.query (
                'UPDATE `users` SET `password` = ? WHERE `email` = ?',
                [newPasswd, email],
                (err) => {
                    if (err) {
                        reject (err);
                    }
                    return resolve(true);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

const findPassword = (email) => {
    return new Promise (async (resolve, reject) => {
        try {
            DBConnection.query (
                'SELECT `password` FROM `users` WHERE email = ?', 
                [email],
                (err, rows) => {
                    if(err) {
                        reject(err);
                        return;
                    }

                    if (!rows || rows.length === 0) {
                        reject(new Error(`找不到使用者密碼`));
                        return;
                    }

                    let passwd = rows[0].password;
                    resolve(passwd);
                }
            );
        } catch (err) {
            reject (err);
        }
    });
};

const getUserMessage = () => {
    return new Promise ((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT `username`, `email`, `role`, `createdAt` FROM users WHERE 1',
                (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    console.log(row);
                    resolve(row);
                }
            )
        } catch (err) {
            reject(err);
        }
    })
};

// 使用email查詢使用者的權限
const getUserRole = (email) => {
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
};

const getChtData = async() =>{
    try {
        const response = await fetch('https://mams.cht.com.tw/odata/api/v1-Odata/ObservationsLatest?count=false', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CHT_BEABER}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        };

        return response.json();
    } catch (err) {
        console.error(err.response)
    }
}

const getHitikiData = async () => {
    try {
        const rawdata  = await fs.readFile('../json/hotiki_last.json');
        const HitikiData = JSON.parse(rawdata);
        return HitikiData;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const getCC22Data = async () => {
    try {
        const rawdata = await fs.readFile('../json/cc22.json');
        const getCC22Data = JSON.parse(rawdata);
        return getCC22Data;
    } catch (err) {
        console.log(err);
        return [];
    }
};

const getMeinongData = async () => {
    try {
        const response = await axios.get('https://api.thingspeak.com/channels/1395182/feeds.json?api_key=GBZ0TBC3ELJEPUO2&results=2');
        await fs.writeFile('../json/meinong.json', JSON.stringify(response.data, null, 2));
        const rawdata = await fs.readFile('../json/meinong.json');
        const getMeinongData = JSON.parse(rawdata);
        return getMeinongData;
    } catch (err) {
        console.log(`Error fetching and saving data: ${err}`)
    }
};

const getKingkitData = async () => {
    try {
        const response = await axios.get('https://agric-dashboard.webduino.io/api/fields/40/deviceData', {
            auth : {
                username: '0a93d41e3f2df05736192e6fd7849d797b70be5a',
                password: '0a93d41e3f2df05736192e6fd7849d797b70be5a',
            }
        });
        const originalData = response.data[0].data
        const time = response.data[0].dataCreateTime
        const values = originalData.match(/(\d+\.\d+),(\d+\.\d+),(\d+\.\d+),(\d+)/);
        if (values) {
            const temp = Math.round(parseFloat(values[1]) * 10) /10;
            const humd = Math.round(parseFloat(values[2]));
            const par = parseFloat(values[3]);
            const soilMoistureRaw = parseFloat(values[4]);

            const parTolux = (par) => {
                const parToRawData = (par) => {
                  if (par < 0) return 0;
                  const rawData = par <= 122.467
                    ? (par + 0.533) / 0.041 : (2 * Math.pow(10, 7 / 2) * Math.sqrt(252625 * par + 164147817) - 82500000) / 2021;
                  return rawData;
                }
                const rawDataTolux = (rawData) => rawData > 0 ? rawData * 3.44 : 0;
                return rawDataTolux(parToRawData(par));
            };
            
            const lux = Math.round(parTolux(par));
            const soilHumd = Math.round((1023 - soilMoistureRaw) * 0.242);

            // 串接成JSON物件
            const jsonData = {
                'time' : time,
                'temp' : temp,
                'humd' : humd,
                'lux' : lux,
                'soilHumd': soilHumd,
            }

            await fs.writeFile('../json/kingkit.json', JSON.stringify(jsonData, null, 2));
        }
        
        const rawdata = await fs.readFile('../json/kingkit.json');
        const getKingkitData = JSON.parse(rawdata);
        return getKingkitData;
    } catch (err) {
        console.log(`Error fetching and saving data: ${err}`)
    }
};



module.exports = {
    updatePasswd:updatePasswd,
    changePassword: changePassword,
    findPassword: findPassword,
    getUserRole : getUserRole,
    getUserMessage: getUserMessage,
    getChtData: getChtData,
    getHitikiData: getHitikiData,
    getCC22Data: getCC22Data,
    getMeinongData: getMeinongData,
    getKingkitData: getKingkitData,
    getCookieValue: getCookieValue,
}
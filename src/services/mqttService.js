const mqtt = require('mqtt');
const fs = require('fs');
const mqttOptions = require('../configs/mqttConnection');

const convertWindDirections = (direction) => {
    const convertedDirections = [
        "北", "北北東", "東北", "東北東", "東", "東南東", "東南", "南南東",
        "南", "南南西", "西南", "西南西", "西", "西北西", "西北", "北北西"
    ];
    
    const index = Math.round((direction % 360) / 22.5);
    return convertedDirections[index];
};

// 使用MQTT接收不同場域資料
const connectYufengEcMQTT = () => {
    client = mqtt.connect(`mqtt://${mqttOptions().server}:${mqttOptions().port}`);
    try {
        client.on('message', (topic, message) => {
            const mqttMessage = message.toString();
            const timestamp = Date.now();
            const formattedTimestamp = new Date(timestamp).toISOString();
            const convertedJSON = {
                'time': `${formattedTimestamp}`,
                'EC':`${mqttMessage}mS/cm`,
                'EC_Gauge':`${mqttMessage}`
            };

            fs.writeFile('C:/xampp/htdocs/kdais/json/ec_data.json', JSON.stringify(convertedJSON), (err) => {
                if (err) throw err;
                console.log('保存最後一筆EC值');
            });
        });

        client.on('connect', () => {
            client.subscribe(mqttOptions().yufeng_EC_topic);
            console.log('MQTT 玉峰園藝EC連線成功');
        });

        client.on('error', (err) => {
            console.log('MQTT 連線錯誤:', err);
        });
    } catch (err) {
        console.error(err);
    }
};

const connectYufengMQTT = () => {
    client2 = mqtt.connect(`mqtt://${mqttOptions().hivemqserver}:${mqttOptions().port}`)
    try {
        client2.on('connect', () => {
            client2.subscribe(mqttOptions().twiot_weather_topic);
            console.log('Yufeng weather MQTT topic connected successfully');
        });

        client2.on('error', (err) => {
            console.log('MQTT 連線錯誤:', err);
        });

        client2.on('message', (topic, message) => {
            try {
                const mqttMessage = message.toString();
                const data = JSON.parse(mqttMessage);
                const convertedDirection = convertWindDirections(data.WDIR);

                const convertedJSON = {
                    'TIME': data.time,
                    'TEMP': `${data.TEMP}°C`,
                    'HUMD': `${data.HUMD}%`,
                    'RAIN': `${data.RAIN}mm`,
                    'SoilMoisture': `${data.SoilMoisture}%`,
                    'LeafWet': `${data.LeafWet}%`,
                    'PAR': `${data.PAR}μmol/m^2/s`,
                    'SolarRad': `${data.SolarRad}W/m2`,
                    'WDIR': `${convertedDirection}`,
                    'WDSD': `${data.WDSD}m/s`,
                    'H_FX': `${data.H_FX}m/s`,
                    'DewPoint': `${data.DewPoint}°C`,
                    'TEMP_Gauge': `${data.TEMP}`,
                    'HUMD_Gauge': `${data.HUMD}`
                };

                fs.writeFile('C:/xampp/htdocs/kdais/json/weather_data.json', JSON.stringify(convertedJSON), (err) => {
                    if (err) throw err;
                    console.log('Save Yufeng latest Weather Data');
                });
            } catch (err) {
                console.log('解析MQTT資料錯誤', err);
            }
        });
        
    } catch (err) {
        console.error(err);
    }
};

const connectMQTT = (client_name, temp_topic, humd_topic, file_name) => {
    client_name = mqtt.connect(`mqtt://${mqttOptions().hivemqserver}:${mqttOptions().port}`);
    try {
        const sensorData = {
            time: null,
            ligang_temp: null,
            ligang_humd: null,
        };

        client_name.on('connect', ()=> {
            const topics = [
                temp_topic,
                humd_topic,
            ];
            client_name.subscribe(topics);
            console.log(`${file_name} MQTT topic connected successfully`);
        });

        client_name.on('error', (err) => {
            console.log('MQTT connection error:', err);
        });

        client_name.on('message', (topic, message) => {
            const mqttMessage = message.toString();
            const ligangData = JSON.parse(mqttMessage);
            if (topic === temp_topic) {
                sensorData.time = ligangData.time;
                sensorData.ligang_temp = ligangData.value;
            } else if (topic === humd_topic) {
                sensorData.ligang_humd = ligangData.value;
            }

            if (Object.values(sensorData).every((value) => value !== null)) {
                fs.writeFile(`C:/xampp/htdocs/kdais/json/${file_name}.json`, JSON.stringify(sensorData), (err) => {
                    if (err) throw err;
                    console.log(`Save lastest Ligang ${file_name} Data`);
                });
            }
        });
    } catch(err) {
        console.error(err);
    }
};

const connectLigangMQTT = (client_name, temp_topic, humd_topic, lux_topic, file_name) => {
    client_name = mqtt.connect(`mqtt://${mqttOptions().hivemqserver}:${mqttOptions().port}`);
    try {
        const sensorData = {
            time: null,
            ligang_temp: null,
            ligang_humd: null,
            ligang_lux: null,
        };

        client_name.on('connect', ()=> {
            const topics = [
                temp_topic,
                humd_topic,
                lux_topic
            ];
            client_name.subscribe(topics);
            console.log(`${file_name} MQTT topic connected successfully`);
        });

        client_name.on('error', (err) => {
            console.log('MQTT connection error:', err);
        });

        client_name.on('message', (topic, message) => {
            const mqttMessage = message.toString();
            const ligangData = JSON.parse(mqttMessage);
            if (topic === temp_topic) {
                sensorData.time = ligangData.time;
                sensorData.ligang_temp = ligangData.value;
            } else if (topic === humd_topic) {
                sensorData.ligang_humd = ligangData.value;
            } else if (topic === lux_topic) {
                sensorData.ligang_lux = ligangData.value;
            }

            if (Object.values(sensorData).every((value) => value !== null)) {
                fs.writeFile(`C:/xampp/htdocs/kdais/json/${file_name}.json`, JSON.stringify(sensorData), (err) => {
                    if (err) throw err;
                    console.log(`Save lastest Ligang ${file_name} Data`);
                });
            }
        });
    } catch(err) {
        console.error(err);
    }
};

module.exports = {
    connectMQTT,
    connectLigangMQTT,
    connectYufengEcMQTT,
    connectYufengMQTT,
};
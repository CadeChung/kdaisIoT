const mqtt = require('mqtt');
const mqttOptions = require('../configs/mqttConnection');

const getPageMQTT = async (req, res) => {
    try {
        return res.render("EC_Monitor.ejs", { message: "狀態：已連線" });
    } catch (err) {
        console.error(err);
        return res.status(500).send('伺服器錯誤');
    }
};

const handleMqttConnect = async( req, res) => {
    try {
        await connectMQTT(io);
        return res.status(200).send('連線成功')
    } catch (err) {
        return res.status(500).send('伺服器錯誤');
    }
}

const connectMQTT = (io) => {
    // 設定MQTT連線
    client = mqtt.connect(`mqtt://${mqttOptions().server}:${mqttOptions().port}`);
    try {
        io.on('connection', (socket) => {
            console.log('Socket 已連線')

            socket.emit('Radial-Gauge', {
              msg: '連線中...',
            })
          
            client.on('message', (topic, message) => {
              const mqttMessage = message.toString();
              socket.emit('Radial-Gauge', {
                msg: mqttMessage,
              });
              console.log(mqttMessage);
            });
          });
          
        // MQTT訂閱事件處理
        client.on('connect', () => {
            client.subscribe(mqttOptions().topic);
            console.log('MQTT 連線成功');
        });
        // 連線錯誤
        client.on('error', (error) => {
            console.error('MQTT 連線錯誤:', error);
        });

    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getPageMQTT,
    connectMQTT,
    handleMqttConnect,
};
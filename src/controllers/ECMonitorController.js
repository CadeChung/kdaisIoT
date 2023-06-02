const mqtt = require('mqtt');
const mqttOptions = require('../configs/mqttConnection');
const chartService = require('../services/chartService');

const getPageECMonitor = async (req, res) => {
    try {
        return res.render("EC_Monitor.ejs", { message: "狀態：已連線" });
    } catch (err) {
        console.error(err);
        return res.status(500).send('伺服器錯誤');
    }
};

const getPageChartEC = async (req, res) => {
    try {
        return res.render("EC_Chart.ejs")
    } catch (err) {
        console.error(err);
        return res.status(500).send('伺服器錯誤');
    }
}

const handleChartSelect = async(req, res) => {
    try {
        const timeRange = req.body['time-range']; // 從請求中獲取timeRange參數
        const results = await chartService.getChartData(timeRange); // 調用Service函數獲取數據
        console.log(results.ECs)
        // 在這裡使用startTime和endTime來查詢數據庫，並生成相應的圖表
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('伺服器網路錯誤'); // 返回500錯誤
    }
}

const handleMqttConnect = async(req, res) => {
    try {
        await connectMQTT(io);
        return res.status(200).send('連線成功')
    } catch (err) {
        return res.status(500).send('伺服器錯誤');
    }
}

const connectMQTT = (sio) => {
    // 設定MQTT連線
    client = mqtt.connect(`mqtt://${mqttOptions().server}:${mqttOptions().port}`);
    try {

        /*MQTT*/
        client.on('message', (topic, message) => {
            const mqttMessage = message.toString();
            sio.emit('EC-Value', {
                'msg': mqttMessage,
            });
            console.log(mqttMessage);
        });

        client.on('connect', () => {
            client.subscribe(mqttOptions().topic);
            console.log('MQTT 連線成功');
        });

        client.on('error', (err) =>{
            console.error('MQTT 連線錯誤:', err);
        });
        
        /*Socket.io*/
        sio.on('connection', (socket) => {
            console.log('Socket 已連線')
            socket.emit('EC-Value',{ 
                msg: '連線中...',
            });
        });

    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getPageECMonitor,
    connectMQTT,
    handleMqttConnect,
    getPageChartEC,
    handleChartSelect,
};
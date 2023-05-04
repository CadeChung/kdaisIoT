require('dotenv').config();

const mqttOptions = () => ({
    server: process.env.MQTT_SERVER,
    user: process.env.MQTT_USERNAME,
    pass: process.env.MQTT_PASSWORD,
    topic: process.env.MQTT_TOPIC,
    port: process.env.MQTT_PORT,
})

module.exports = mqttOptions;
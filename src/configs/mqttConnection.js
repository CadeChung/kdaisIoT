require('dotenv').config();

const mqttOptions = () => ({
    server: process.env.MQTT_SERVER,
    user: process.env.MQTT_USERNAME,
    pass: process.env.MQTT_PASSWORD,
    yufeng_EC_topic: process.env.YUFENG_EC_TOPIC,
    port: process.env.MQTT_PORT,
    hivemqserver: process.env.HIVEMQ_SERVER,
    twiot_weather_topic: process.env.TWIOT_WEATHER_TOPIC,
    cc22_temp_topic: process.env.CC22_TEMP_TOPIC,
    cc22_humd_topic: process.env.CC22_HUMD_TOPIC,
    ligang_v1_temp_topic: process.env.LIGANG_V1_TEMP_TOPIC,
    ligang_v1_humd_topic: process.env.LIGANG_V1_HUMD_TOPIC,
    ligang_v2_temp_topic: process.env.LIGANG_V2_TEMP_TOPIC,
    ligang_v2_humd_topic: process.env.LIGANG_V2_HUMD_TOPIC,
    ligang_v3_temp_topic: process.env.LIGANG_V3_TEMP_TOPIC,
    ligang_v3_humd_topic: process.env.LIGANG_V3_HUMD_TOPIC,
    ligang_v5_temp_topic: process.env.LIGANG_V5_TEMP_TOPIC,
    ligang_v5_humd_topic: process.env.LIGANG_V5_HUMD_TOPIC,
    ligang_v5_lux_topic: process.env.LIGANG_V5_LUX_TOPIC,
});

module.exports = mqttOptions;
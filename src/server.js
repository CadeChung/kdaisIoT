// 請求.env的內容
require('dotenv').config();
// 引用相關套件
const express = require('express'),
      configViewEngine = require('./configs/viewEngine'),
      initWebRoutes = require("./routers/web"),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      connectFlash = require('connect-flash'),
      passport = require('passport');
      jwt = require("jsonwebtoken");
      mqttOptions = require('./configs/mqttConnection');
//引用MQTT
const app = express();
const server = require('http').Server(app);
const {connectMQTT, connectYufengEcMQTT, connectYufengMQTT} = require('./services/mqttService');

// 解析 cookie
app.use(cookieParser(process.env.COOKIE));

// 設定 session
app.use(session ({
  secret: process.env.SESSION,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
  }
}));

// 解析瀏覽器的資料
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 設定 view 模板引擎
configViewEngine(app);

// 開啟簡單的消息功能，傳遞正確或錯誤訊息
app.use(connectFlash());

// 設定身分驗證的中間件，可用於處理各種身份驗證策略，例如本地驗證、社交媒體驗證、OAuth等。
app.use(passport.initialize());
app.use(passport.session());

// 初始化所有的網頁路由
initWebRoutes(app);

// 設定狀態碼為404的頁面
app.use((req, res) => {
  res.status(404).render("auth/404.ejs");
});

// 設定伺服器port
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`伺服器運行中 Port為 ${port}!`));

// // 定義檢視記憶體使用量的函式
// function monitorMemoryUsage() {
//   const used = process.memoryUsage();
//   for (let key in used) {
//     console.log(`${key} ${Math.round(used[key] / 1024 / 1024 *100)/100} MB`);
//   }
// }

// // 定期監測記憶體使用量的時間間隔（以毫秒為單位）
// const memoryUsageInterval = 5000; // 5秒

// // 建立定期監測記憶體使用量的計時器
// const memoryUsageTimer = setInterval(monitorMemoryUsage, memoryUsageInterval);

// 讀取mqtt控制器
//connectYufengEcMQTT();
//connectYufengMQTT();
// cc22_topics = [mqttOptions().cc22_temp_topic, mqttOptions().cc22_humd_topic];
// ligangv2_topics = [mqttOptions().ligang_v2_temp_topic, mqttOptions().ligang_v2_humd_topic];
// ligangv3_topics = [mqttOptions().ligang_v3_temp_topic, mqttOptions().ligang_v3_humd_topic];
// ligangv5_topics = [mqttOptions().ligang_v5_temp_topic, mqttOptions().ligang_v5_humd_topic, mqttOptions().ligang_v5_lux_topic];
// connectMQTT(`cc22_client`,  cc22_topics,'cc22');
// connectMQTT(`ligangv2_client`, ligangv2_topics, 'ligangv2');
// connectMQTT(`ligangv3_client`, ligangv3_topics, 'ligangv3');
// connectMQTT(`ligangv5_client`, ligangv5_topics, 'ligangv5');
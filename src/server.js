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

const mqttController = require('./controllers/mqttController');
// 引入Socket.IO模組
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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
  res.status(404).render("404.ejs");
});

// 設定伺服器port
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`伺服器運行中 Port為 ${port}!`));

// 讀取mqtt控制器
mqttController.connectMQTT(io);
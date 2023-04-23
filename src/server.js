// 請求.env的內容
require('dotenv').config();
// 引用相關套件
const express = require('express');
const configViewEngine = require('./configs/viewEngine');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const passport = require('passport');
const initWebRoutes = require("./routers/web")

const app = express();

// 解析 cookie
app.use(cookieParser('secret'));

// 設定 session
app.use(session ({
  secret: 'secret',
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`伺服器運行中 Port為 ${port}!`));
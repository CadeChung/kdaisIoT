require('dotenv').config();
const express = require("express");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const userController = require("../controllers/userController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const resetPasswordController = require("../controllers/resetPasswordController");
const adminController = require("../controllers/adminController");
const yufengController = require("../controllers/yufengController");
const ligangController = require("../controllers/ligangController");
const auth = require("../validation/authValidation");
const passport = require("passport");
const initPassportLocal = require("../controllers/passportLocalController");
const cors = require('cors');

// 初始化所有 Passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.use(cors());
    router.use(adminController.addCustomHeader);

    router.get("/", loginController.checkLoggedIn, userController.getPageDashboard);
    // 使用者的router
    router.get("/iot/user/dashboard", loginController.checkLoggedIn, userController.getPageDashboard);
    // admin的router
    //router.get("/iot/admin/dashboard", loginController.checkLoggedIn, adminController.getPageAdmin);
    router.get("/iot/admin/dashboard", adminController.getPageAdmin);
    // 每個串流API的位置
    //router.get("/iot/admin/dashboard", adminController.getPageAdmin);
    router.get("/iot/admin/cht-data/latest", adminController.lastChtData);
    router.get("/iot/admin/hitiki-data/latest", adminController.lastHitikiData);
    router.get("/iot/admin/cc22-data/latest", adminController.lastCC22Data);
    router.get("/iot/admin/meinong-data/latest", adminController.lastMeinongData);
    router.get("/iot/admin/kingkit-data/latest", adminController.lastKingkitData);
    router.get("/iot/admin/message/all/users", adminController.userMessage);
    router.post("/iot/admin/api/change-password", adminController.changePassword);

    // ligang
    router.get("/api/ligang/latest", ligangController.getLastData);

    // 玉峰園藝router
    //router.get("/iot/yufeng/dashboard", loginController.checkLoggedIn, yufengController.getPageECMonitor);
    router.get("/iot/yufeng/dashboard", yufengController.getPageYufengMonitor);
    router.get("/iot/yufeng/dashboard/chart", loginController.checkLoggedIn, yufengController.getPageYufengChart);
    router.get("/iot/ligang/dashboard", ligangController.getPageLigangMonitor);
    router.get("/api/history_data", loginController.checkLoggedIn, yufengController.getHistoryData);
    //router.get('/api/last_data', loginController.checkLoggedIn, yufengController.getLastData);
    router.get('/api/last_data', yufengController.getLastData);
    router.get('/api/weatherforecast', yufengController.getWeatherForecastAPI);

    router.get("/login", loginController.checkLoggedOut, loginController.getPageLogin);
    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        const user = req.user;
        const sectrtKey = process.env.SECRET_CODE;
        const payload = {
            email: user.email,
        };
        const token = jwt.sign(payload, sectrtKey, {expiresIn:'3h'});
        if (req.user.role === 'admin') {
            console.log(req.user.email)
            res.cookie('myCookie', token, { maxAge: 3 * 60 * 60 * 1000 });
            res.redirect('/iot/admin/dashboard');
        }
        if (req.user.role === 'user') {
            console.log(req.user.email)
            res.redirect('/iot/user/dashboard');
        }
        if (req.user.role === 'yufeng') {
            console.log(req.user.role)
            res.redirect('/iot/yufeng/dashboard');
        }
    });

    router.get("/register", registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createUser);
    router.post("/logout", loginController.postLogOut);

    router.get("/forgotpassword", forgotPasswordController.getPageForgetPassword);
    router.post("/forgotpassword", auth.validateForgotPassword, forgotPasswordController.handleForgotPassword)

    router.get("/reset", resetPasswordController.getPageResetpassword)
    router.post("/reset", auth.validateResetPassword, resetPasswordController.handleResetPassword)

    return app.use("/", router);
};

module.exports = initWebRoutes;
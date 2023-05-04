const express = require("express");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const dashboardController = require("../controllers/dashboardController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const resetPasswordController = require("../controllers/resetPasswordController");
const adminController = require("../controllers/adminController");
const mqttController = require("../controllers/mqttController");
const auth = require("../validation/authValidation");
const passport = require("passport");
const initPassportLocal = require("../controllers/passportLocalController");

// 初始化所有 Passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, dashboardController.getPageDashboard);
    router.get("/iot/user/dashboard", loginController.checkLoggedIn, dashboardController.getPageDashboard);
    router.get("/iot/admin/dashboard", loginController.checkLoggedIn, 
                                       adminController.checkAdminPermission);
    router.get("/iot/yufeng/dashboard", loginController.checkLoggedIn, mqttController.getPageMQTT);
    //router.get("/iot/yufeng/dashboard", mqttController.getPageMQTT);
    router.get("/login",loginController.checkLoggedOut, loginController.getPageLogin);
    router.post('/login',passport.authenticate('local', {
        failureRedirect: '/login'}), 
        (req, res) => {
            if (req.user.role === 'admin') {
                console.log(req.user.email)
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


    router.get("/register",  registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createUser);
    router.post("/logout", loginController.postLogOut);

    router.get("/forgotpassword", forgotPasswordController.getPageForgetPassword);
    router.post("/forgotpassword", auth.validateForgotPassword, forgotPasswordController.handleForgotPassword)

    router.get("/reset", resetPasswordController.getPageResetpassword)
    router.post("/reset", auth.validateResetPassword, resetPasswordController.handleResetPassword)

    return app.use("/", router);
};

module.exports = initWebRoutes;
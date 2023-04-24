const express = require("express");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const dashboardController = require("../controllers/dashboardController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const auth = require("../validation/authValidation");
const passport = require("passport");
const initPassportLocal = require("../controllers/passportLocalController");

// 初始化所有 Passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    
    router.get("/", loginController.checkLoggedIn, dashboardController.handleHelloWorld);
    router.get("/login",loginController.checkLoggedOut, loginController.getPageLogin);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/register",  registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createUser);
    router.post("/logout", loginController.postLogOut);

    router.get("/forgotpassword", forgotPasswordController.getPageForgetPassword);
    router.post("/forgotpassword", auth.validateForgotPassword, forgotPasswordController.handleForgotPassword)

    return app.use("/", router);
};

module.exports = initWebRoutes;
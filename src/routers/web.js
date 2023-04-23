const express = require("express");
const auth = require("../validation/authValidation");
const passport = require("passport");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");

let router = express.Router();

let initWebRoutes = (app) => {
    
    router.get("/", (req, res) => {
        return res.render("dashboard.ejs")
    });


    router.get("/login", loginController.getPageLogin);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/register",  registerController.getPageRegister);
    router.post("/register", auth.validateRegister, registerController.createUser);

    return app.use("/", router);
};

module.exports = initWebRoutes;
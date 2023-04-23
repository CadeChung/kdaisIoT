const express = require("express")
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");

let router = express.Router()

let initWebRoutes = (app) => {
    
    router.get("/", (req, res) => {
        return res.render("dashboard.ejs")
    });

    router.get("/login", loginController.getPageLogin);
    router.get("/register", registerController.getPageRegister);
    router.post("/register", registerController.createUser);

    return app.use("/", router);
};

module.exports = initWebRoutes;
const adminService = require("../services/adminService");

let addCustomHeader = (req, res, next) => {
    res.header('Access-Comtrol-Allow-Origin', '*')
    next();
};

let getPageAdmin = async (req, res) => {
    return res.render("admin/admin.ejs");
};

let changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const token = req.headers.cookie;
        const result = await adminService.changePassword(token, currentPassword, newPassword);
        return res.json(result);
    } catch {
        return res.status(500).send('伺服器錯誤');
    }
};

let userMessage = async (req, res) => {
    try {
        const message = await adminService.getUserMessage();
        return res.json(message);  // 將用戶信息以 JSON 格式發送到前端
    } catch (err) {
        return res.status(500).send('伺服器錯誤');
    }
};

let checkAdminPermission = async (req, res) => {
    const email = req.user.email
    const role = await adminService.getUserRole(email)
    console.log(role.role)
    if (role.role !== 'admin'){
        return res.status(501).render("auth/501.ejs");
    } else {
        return getPageAdmin(req, res);
    }
};

let lastChtData = async (req, res) => {
    try {
        const lastData = await adminService.getChtData();
        res.json(lastData);
    } catch (err) {
        return res.status(500).send('伺服器錯誤');
    }
};

let lastHitikiData = async (req, res) => {
    try {
        const lastData = await adminService.getHitikiData();
        res.json(lastData);
    } catch {
        return res.status(500).send('伺服器錯誤');
    }
};

let lastCC22Data = async (req, res) => {
    try {
        const lastData = await adminService.getCC22Data();
        return res.json(lastData);
    } catch {
        return res.status(500).send('伺服器錯誤');
    }
};

let lastMeinongData = async (req, res) => {
    try {
        const lastData = await adminService.getMeinongData();
        return res.json(lastData);
    } catch {
        return res.status(500).send('伺服器錯誤');
    }
};

let lastKingkitData = async (req, res) => {
    try {
        const lastData = await adminService.getKingkitData();
        return res.json(lastData);
    } catch {
        return res.status(500).send('伺服器錯誤');
    }
};

module.exports = {
    changePassword: changePassword,
    addCustomHeader:addCustomHeader,
    getPageAdmin: getPageAdmin,
    userMessage: userMessage,
    checkAdminPermission : checkAdminPermission,
    lastChtData: lastChtData,
    lastHitikiData: lastHitikiData,
    lastCC22Data: lastCC22Data,
    lastMeinongData: lastMeinongData,
    lastKingkitData: lastKingkitData,
};
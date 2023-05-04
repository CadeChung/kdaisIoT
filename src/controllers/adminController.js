const adminService = require("../services/adminService");

let getPageAdmin = async (req, res) => {
    return res.render("admin.ejs", {
        user: req.user
    });
};

let checkAdminPermission = async (req, res, next) => {
    const email = req.user.email
    
    const role = await adminService.getUserRole(email)
    console.log(role.role)
    if (role.role !== 'admin'){
        return res.status(501).render("501.ejs");
    } else {
        getPageAdmin(req, res);
    }

    next();
}

module.exports = {
    getPageAdmin: getPageAdmin,
    checkAdminPermission : checkAdminPermission,
};
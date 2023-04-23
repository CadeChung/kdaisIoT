let getPageLogin = (req, res) => {
    res.render("login.ejs", { message : "" })
};

module.exports = {
    getPageLogin: getPageLogin
};
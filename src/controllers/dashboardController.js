let handleHelloWorld = async (req, res) => {
    return res.render("dashboard.ejs", {
        user: req.user
    });
};

module.exports = {
    handleHelloWorld: handleHelloWorld
};
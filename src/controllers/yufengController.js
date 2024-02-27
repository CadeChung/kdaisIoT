const yufengService = require('../services/yufengService');

const getPageYufengMonitor = async (req, res) => {
    try {
        return res.render("user_templates/yufengmonitor.ejs");
    } catch (err) {
        console.log(err);
        return res.status(500).send('伺服器錯誤');
    }
};

const getPageYufengChart = async (req, res) => {
    try {
        return res.render("user_templates/yufenghistory.ejs");
    } catch (err) {
        console.log(err);
        return res.status(500).send('伺服器錯誤');
    }
};


const getHistoryData = async (req, res) => {
    try {
        const deviceID = req.query.device;
        const days = req.query.days;
        const loadData =  await yufengService.getHistoryDataForYufeng(deviceID, days);
        res.json(loadData);
    } catch (err) {
        console.log(err);
        res.status(500).send('網路錯誤');
    }
};

const getLastData = async (req, res) => {
    try {
        const loadData = await yufengService.getYufengLastData();
        res.json(loadData);
    } catch (err) {
        console.log(err);
        res.status(500).send('網路錯誤');
    }
}

const getWeatherForecastAPI = async (req, res) => {
    try {
        const loadData = await yufengService.getWeatherForecast();
        res.json(loadData);
    } catch (err) {
        console.log(err);
        res.status(500).send('網路錯誤');
    }
}

module.exports = {
    getPageYufengMonitor,
    getPageYufengChart,
    getHistoryData,
    getLastData,
    getWeatherForecastAPI,
};
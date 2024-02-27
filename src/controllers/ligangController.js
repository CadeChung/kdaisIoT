const ligangService = require('../services/ligangService');

const getPageLigangMonitor = async (req, res) => {
  try {
      return res.render("user_templates/ligangMonitor.ejs");
  } catch (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
  }
};

const getPageLigangHistory = async (req, res) => {
  try {
      return res.render("user_templates/ligangHistory.ejs");
  } catch (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
  }
};

const getLastData = async (req, res) => {
  try {
    const lastestData = await ligangService.getLigangLastData();
    return res.json(lastestData);
  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤');
  }
};

const getLigangHistoryData = async(req, res) => {
  try {
    let selectDays = req.query.days;
    const historyData = await ligangService.readHistoryData(selectDays);
    return res.json(historyData);
  } catch (err) { 
    console.error(err);
  }
};

module.exports = {
  getPageLigangMonitor,
  getPageLigangHistory,
  getLastData,
  getLigangHistoryData,
};
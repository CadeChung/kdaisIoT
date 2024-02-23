const ligangService = require('../services/ligangService');

const getPageLigangMonitor = async (req, res) => {
  try {
      return res.render("user_templates/ligangMonitor.ejs");
  } catch (err) {
      console.error(err);
      return res.status(500).send('伺服器錯誤');
  }
};

const getLastData = async (req, res) => {
  try {
    const last_v2_Data = await ligangService.getLigangLastData();
    console.log(last_v2_Data);
    res.json(last_v2_Data);
  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤');
  }
};

module.exports = {
  getPageLigangMonitor,
  getLastData
};
const fs = require("fs").promises;

const getLigangLastData = async() => {
  try {
    const v2data = await fs.readFile("C:/xampp/htdocs/kdais/json/ligangv2.json");
    const v3data = await fs.readFile("C:/xampp/htdocs/kdais/json/ligangv3.json");
    const v5data = await fs.readFile("C:/xampp/htdocs/kdais/json/ligangv5.json");
    const convertedv2JSON = JSON.parse(v2data);
    const convertedv3JSON = JSON.parse(v3data);
    const convertedv5JSON = JSON.parse(v5data);
    const ligangAllData = {
      v2: convertedv2JSON,
      v3: convertedv3JSON,
      v5: convertedv5JSON
    };

    return ligangAllData;
  } catch (err) {
    console.error(err.response)
    return [];
  }
};

const readHistoryData = async(days) => {
  try {
    const historyData = await fs.readFile("C:/xampp/htdocs/kdais/json/liganghistory.json");
    const historyDataParsed = JSON.parse(historyData);

    const filterDataByDays = historyDataParsed.filter((item) => {
      const dataTime = new Date(item.time);
      const currentTime = new Date();
      const diffTime = Math.abs(currentTime.getTime() - dataTime.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });
    return filterDataByDays;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getLigangLastData,
  readHistoryData
};
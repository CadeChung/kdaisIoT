const DBConnection = require("../configs/DBConnection");
const moment = require('moment');

let getChartData = async (timeRange) => {
  return new Promise(async (resolve, reject) => {
    try {
      DBConnection.query(
        ' SELECT DATE_FORMAT(date - INTERVAL SECOND(date) SECOND + INTERVAL 5 - MINUTE(date) % 5 MINUTE, "%Y-%m-%d %H:%i:%s") AS time_slot, \
          AVG(EC) AS avg_ec \
          FROM ec_data \
          WHERE date BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND NOW() GROUP BY time_slot; ', timeRange,
        
        ( err, rows ) => {
          if(err) {
            reject(err)
          }
          const dates = rows.map((row) => {
            return moment(row.time_slot).format('YYYY-MM-DD HH:mm:ss')
          })
          const ECs = rows.map((row) => {
            return row.avg_ec
          })
          resolve({dates, ECs})
        }
      );
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  getChartData
};
const fs = require("fs").promises;
const localStorage = require('localStorage');

const getYufengLastData = async () => {
    try {
        const rawdata = await fs.readFile('C:/xampp/htdocs/kdais/json/ec_data.json');
        const rawdata2 = await fs.readFile('C:/xampp/htdocs/kdais/json/weather_data.json');
        const ecData = JSON.parse(rawdata);
        const weatherData = JSON.parse(rawdata2)
        
        const convertedJSON = {
            ecData,
            weatherData
        }
        //console.log(convertedJSON)
        return convertedJSON;
    } catch (err) {
        console.error(err.response);
        return [];
    }
};

const getHistoryDataForYufeng = async (deviceID, days) => {
    try {
        const rawdata2 = await fs.readFile('C:/xampp/htdocs/kdais/backend/src/models/neipu.json')
        const neipuData = JSON.parse(rawdata2)

        if (deviceID === 'EC0001') {
            const filteredData = neipuData[0].filter(item => {
                const date = new Date(item.time);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= days;
            });

            const averages = [];
            let currentAverage = 0;
            let count = 0;
            let currentEndTime = null;

            for (let i = 0; i < filteredData.length; i++) {
                const currentData = filteredData[i]
                const currentEC = parseFloat(currentData.EC)
                const currentTime = new Date(currentData.time);

                currentAverage += currentEC;
                count++;

                if (i === filteredData.length - 1 || currentTime - currentEndTime >= 10 * 60 * 1000) {
                    averagesEC = (currentAverage / count).toFixed(2);
                    averages.push({
                        'time': currentTime,
                        'ec': parseFloat(averagesEC)
                    });
                    currentAverage = 0;
                    count = 0;
                    currentEndTime = new Date(currentTime);
                    currentEndTime.setMinutes(currentEndTime.getMinutes() + 10);
                }
            }

            localStorage.setItem('ecData', JSON.stringify(averages));
            return averages;
        } else if (deviceID === 'KH00000031') {
            const filteredData = neipuData[1].filter(item => {
                const date = new Date(item.time);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - date.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= days;
            });

            const averages = [];
            let currentAverageTEMP = 0;
            let currentAverageHUMD = 0;
            let currentAveragePAR = 0;
            let currentAverageSolarRad = 0;
            let currentAverageSoilMoisture = 0;
            let currentAverageLeafWet = 0;
            let currentAverageWDSD = 0;
            let currentAverageWDIR = 0;
            let currentAverageH_FX = 0;
            let currentAverageRAIN = 0;
            let currentAverageDewPoint = 0;
            count = 0;

            let currentEndTime = null;

            for (let i = 0; i < filteredData.length; i++) {
                const currentData = filteredData[i]
                const currentTEMP = parseFloat(currentData.TEMP)
                const currentHUMD = parseFloat(currentData.HUMD)
                const currentPAR = parseInt(currentData.PAR)
                const currentSolarRad = parseInt(currentData.SolarRad)
                const currentSoilMoisture = parseFloat(currentData.SoilMoisture)
                const currentLeafWet = parseInt(currentData.LeafWet)
                const currentWDSD = parseInt(currentData.WDSD)
                const currentH_FX = parseInt(currentData.H_FX)
                const currentWDIR = parseFloat(currentData.WDIR)
                const currentRAIN = parseFloat(currentData.RAIN)
                const currentDewPoint = parseFloat(currentData.DewPoint)
                const currentTime = new Date(currentData.time);

                currentAverageTEMP += currentTEMP;
                currentAverageHUMD += currentHUMD;
                currentAveragePAR += currentPAR;
                currentAverageSolarRad += currentSolarRad;
                currentAverageSoilMoisture += currentSoilMoisture;
                currentAverageLeafWet += currentLeafWet;
                currentAverageWDSD += currentWDSD;
                currentAverageWDIR += currentWDIR;
                currentAverageH_FX += currentH_FX;
                currentAverageRAIN += currentRAIN;
                currentAverageDewPoint += currentDewPoint;
                count++;

                if (i === filteredData.length - 1 || currentTime - currentEndTime >= 10 * 60 * 1000) {
                    averagesTEMP = (currentAverageTEMP / count).toFixed(1);
                    averagesHUMD = (currentAverageHUMD / count).toFixed(1);
                    averagesPAR = (currentAveragePAR / count).toFixed(0);
                    averagesSolarRad = (currentAverageSolarRad / count).toFixed(0);
                    averagesSoilMoisture = (currentAverageSoilMoisture / count).toFixed(1);
                    averagesLeafWet = (currentAverageLeafWet / count).toFixed(0);
                    averagesWDSD = (currentAverageWDSD / count).toFixed(0);
                    averagesWDIR = (currentAverageWDIR / count).toFixed(2);
                    averagesH_FX = (currentAverageH_FX / count).toFixed(0);
                    averagesRAIN = (currentAverageRAIN / count).toFixed(1);
                    averagesDewPoint = (currentAverageDewPoint / count).toFixed(1);

                    averages.push({
                        'time': currentTime,
                        'TEMP': parseFloat(averagesTEMP),
                        'HUMD': parseFloat(averagesHUMD),
                        'PAR': parseFloat(averagesPAR),
                        'SolarRad': parseFloat(averagesSolarRad),
                        'SoilMoisture': parseFloat(averagesSoilMoisture),
                        'LeafWet': parseFloat(averagesLeafWet),
                        'WDSD': parseFloat(averagesWDSD),
                        'WDIR': parseFloat(averagesWDIR),
                        'H_FX': parseFloat(averagesH_FX),
                        'RAIN': parseFloat(averagesRAIN),
                        'DewPoint': parseFloat(averagesDewPoint)
                    });

                    currentAverageTEMP = 0;
                    currentAverageHUMD = 0;
                    currentAveragePAR = 0;
                    currentAverageSolarRad = 0;
                    currentAverageSoilMoisture = 0;
                    currentAverageLeafWet = 0;
                    currentAverageWDSD = 0;
                    currentAverageWDIR = 0;
                    currentAverageH_FX = 0;
                    currentAverageRAIN = 0;
                    currentAverageDewPoint = 0;
                    count = 0;

                    currentEndTime = new Date(currentTime);
                    currentEndTime.setMinutes(currentEndTime.getMinutes() + 10);
                }
            }

            localStorage.setItem('weatherData', JSON.stringify(averages));
            return averages;
        }

    } catch (err) {
        console.error(err.response);
        return [];
    }
};

const getWeatherForecast = async () => {
    const response = await fetch('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-033?Authorization=CWB-5205EB6A-8913-45D0-BCC2-E54EB14AC8A0', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    };

    return response.json();
}

module.exports = {
    getHistoryDataForYufeng,
    getYufengLastData,
    getWeatherForecast,
};
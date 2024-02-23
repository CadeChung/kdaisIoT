$(document).ready(() => {
    createCwbChartContent('屏東縣', '內埔鄉', 'cwb-chart', 'cwbImageContent1', '');
});

const createCwbChartContent = (_city, _town, _contentID, _cwbInfoContentID, _dataLen) => {
    let url = "http://127.0.0.1:5000/api/weatherforecast";
    $.when(
        $.getJSON(url),
    ).done((res0) => {
        let cwbChart = echarts.init(document.getElementById(_contentID));
        let area = res0.records.locations[0].location.find((item) => {
            return item.locationName === _town;
        });

        window.onresize = () => {
            cwbChart.resize();
        };
        const cwbFooter = document.getElementById('cwb-footer');
        cwbFooter.innerHTML = `<span>來源：${_city}${_town}</span>`;
        wxList = area.weatherElement[1].time;
        console.log(wxList)
        drawCwbChart(area, cwbChart, _dataLen);
    })
}

const drawCwbChart = (area, cwbChart, _dataLen) => {
    if (_dataLen === '') {
        _dataLen = 20;
    }
    let temperature = area.weatherElement[3];
    let humidity = area.weatherElement[4];
    let rainPercentData = area.weatherElement[7];
    let timeList = temperature.time;
    let xAxisData = [];
    let yAxisData = [];
    let minTemp = 100;
    let maxTemp = 0;
    let temperatureThreshold = 15;
    let seriesRainData = [];
    let index = 0;
    const now = new Date();

    const findTemp = timeList.filter(item => item.elementValue[0].value < temperatureThreshold);
    const temperatureWarning = document.getElementById('temperatureWarning');
    //const warningGif = document.getElementById('warningGif');

    if (findTemp.length > 0) {
        const item = findTemp[1];
        const newTime = item.dataTime.substring(0, 16).replace(/-/g, '/');
        const newTemp = item.elementValue[0].value;

        if (newTemp < temperatureThreshold) {
            temperatureWarning.style.display = 'flex';
            // 動態生成 HTML 字符串
            temperatureWarning.innerHTML = `<img class="_img" src="/img/lowtempwarining.gif" alt="警告 GIF">
                                            <p>低溫警告預警通知<br> 時間：${newTime} <br>溫度將低於${temperatureThreshold}度</p>    
                                            `;
            console.log(`${newTime},${newTemp}`)
        } else {
            temperatureWarning.style.display = 'none';
            temperatureWarning.innerHTML = '';
        };
    } else {
        temperatureWarning.style.display = 'none';
        temperatureWarning.innerHTML = '';
    }

    timeList.forEach((time, idx) => {
        if (index >= _dataLen) {
            return;
        }
        const nexDataTime = (idx < timeList.length - 1) ? new Date(timeList[idx + 1].dataTime) : null;
        const dataTime = new Date(time.dataTime);

        if ((Date.parse(dataTime).valueOf() < Date.parse(now).valueOf() && nexDataTime != null && Date.parse(nexDataTime).valueOf() >= Date.parse(now).valueOf())
            || Date.parse(dataTime).valueOf() >= Date.parse(now).valueOf()) {

            const timestring = time.dataTime.substring(0, 16).replace(/-/g, '/');
            const temperature = parseInt(time.elementValue[0].value);

            if (minTemp > temperature) {
                minTemp = temperature;
            }
            if (maxTemp < temperature) {
                maxTemp = temperature;
            }
            xAxisData.push(timestring);
            yAxisData.push(temperature);

            let rp = rainPercentData.time.find((item) => {
                let time = parseInt(timestring.substring(11, 13));
                if (item.endTime.indexOf(timestring.substring(5, 10)) === 10) {
                    let endtime = parseInt(item.endTime.substring(11, 13));
                    if ((endtime - time) <= 6 && (endtime - time) > 0) {
                        return item;
                    }
                }
                else if (item.startTime.indexOf(timestring.substring(5, 10) === 10)) {
                    let startTime = parseInt(item.startTime.substring(11, 13));
                    if ((time - startTime) <= 6 && (time - startTime) >= 0) {
                        return item;
                    }
                }
            });

            seriesRainData.push({
                coord: [timestring, temperature],
                value: rp.elementValue[0].value + "%",
            });
            index++;
        }
    });

    minTemp = Math.floor(minTemp / 5) * 5;
    maxTemp = (Math.ceil((maxTemp) / 5 + 1) * 5);
    seriesRainData.forEach((item) => {
        item.coord = [item.coord[0], maxTemp];
    });

    if (cwbChart != null) {
        drawECharts(cwbChart, xAxisData, yAxisData, seriesRainData, minTemp, maxTemp);
    }
};

const drawECharts = (cwbChart, xAxisData, yAxisData, seriesRainData, minTemp, maxTemp) => {
    let option = {
        tooltip: {
        },
        grid: {
            x: 45,
            y: 45,
            x2: 15,
            y2: 35,
        },
        xAxis: {
            data: xAxisData,
            axisLabel: {
                formatter: function (value) {
                    return value.replace(' ', '\n');
                },
            },
            splitLine: {
                show: true
            }
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            },
            splitLine: {
                show: false
            },
            min: minTemp,
            max: maxTemp,
            interval: 5,
        }],
        series: [
            {
                name: '溫度',
                type: 'line',
                data: yAxisData,
                label: {
                    position: 'top',
                    show: true,
                },
                smooth: true,
                markPoint: {
                    tooltip: {
                        formatter: function (param) {
                            return '降雨機率: </br>  ' + param.value;
                        }
                    },
                    symbolSize: [40, 40],
                    data: seriesRainData,
                },
            },]
    };
    cwbChart.setOption(option);
}
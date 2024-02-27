let arr_TEMP = new Array();
let arr_HUMD = new Array();
let arr_PAR = new Array();
let arr_SolarRad = new Array();
let arr_SoilMoisture = new Array();
let arr_LeafWet = new Array();
let arr_WDSD = new Array();
let arr_WDIR = new Array();
let arr_H_FX = new Array();
let arr_RAIN = new Array();
let arr_DewPoint = new Array();
let arr_EC = new Array();

const goHome = () => {
    window.location.href="http://127.0.0.1:5000/iot/yufeng/dashboard";
};

const formatTime = (time) => {
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(Math.floor(time.getMinutes() / 10) * 10).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const convertWindDirections = (directions) => {
    const convertedDirections = [
        "北", "北北東", "東北", "東北東", "東", "東南東", "東南", "南南東",
        "南", "南南西", "西南", "西南西", "西", "西北西", "西北", "北北西"
    ];
    const convertedDirection = directions.map(direction => {
        const index = Math.round((direction % 360) / 22.5);
        return convertedDirections[index];
    })
    return convertedDirection;
};

const getWeatherData = () => {
    $("#container").empty();
    let days = Number($('#days').val());

    $.getJSON(`http://127.0.0.1:5000/api/history_data?device=EC0001&days=${days}`, (data) => {
        let arr_TIME = new Array();
        for (i = 0; i < data.length; i++) {
            arr_EC.push(data[i].ec);
            const time = new Date(data[i].time);
            arr_TIME.push(formatTime(time));
        }

        window.onresize = function () {
            myChart.resize();
        }

        let myChart = echarts.init(document.getElementById('main'));

        let option = {
            title: {
                text: 'EC值監測',
                textStyle: {
                    color: 'red',
                },
                textAlign: 'auto'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const EC = params[0] ? params[0].value : 'null ';
                    return `EC值: ${EC} μS/cm`;
                },
                textStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: 14,
                }
            },
            legend: {
                data: ['EC值'],
                textStyle: {
                    color: 'black'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    saveAsImage: {}
                }
            },
            textStyle: {
                fontSize: 14,
                fontWeight: "bold"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arr_TIME,
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                min: function (value) {
                    return Math.floor(value.min)
                },
                max: function (value) {
                    return Math.ceil(value.max)
                }
            }],
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                {
                    name: 'EC值',
                    type: 'line',
                    data: arr_EC,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                }
            ]
        };
        myChart.setOption(option)
    })

    $.getJSON(`http://127.0.0.1:5000/api/history_data?device=KH00000031&days=${days}`, (data) => {
        let arr_TIME1 = new Array();
        for (i = 0; i < data.length; i++) {
            const time = new Date(data[i].time)
            arr_TIME1.push(formatTime(time))
            arr_TEMP.push(data[i].TEMP);
            arr_HUMD.push(data[i].HUMD);
            arr_PAR.push(data[i].PAR);
            arr_SolarRad.push(data[i].SolarRad);
            arr_SoilMoisture.push(data[i].SoilMoisture);
            arr_LeafWet.push(data[i].LeafWet);
            arr_WDSD.push(data[i].WDSD);
            arr_WDIR.push(data[i].WDIR);
            arr_H_FX.push(data[i].H_FX);
            arr_RAIN.push(data[i].RAIN);
            arr_DewPoint.push(data[i].DewPoint);
        }

        window.addEventListener('resize', () => {
            myChart.resize();
            myChart2.resize();
            myChart3.resize();
            myChart4.resize();
            myChart5.resize();
        })

        let myChart = echarts.init(document.getElementById('main2'));
        let myChart2 = echarts.init(document.getElementById('main3'));
        let myChart3 = echarts.init(document.getElementById('main4'));
        let myChart4 = echarts.init(document.getElementById('main5'));
        let myChart5 = echarts.init(document.getElementById('main6'));

        let option = {
            title: {
                text: '溫度監測',
                textStyle: {
                    color: 'red',
                },
                textAlign: 'auto'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const TEMP = params[0] ? params[0].value : 'null ';
                    const DewPoint = params[1] ? params[1].value : 'null ';
                    return `大氣溫度: ${TEMP} °C <br>露點溫度: ${DewPoint} °C`;
                },
                textStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: 14,
                }
            },
            legend: {
                data: ['大氣溫度', '露點溫度'],
                textStyle: {
                    color: 'black'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    saveAsImage: {}
                }
            },
            textStyle: {
                fontSize: 14,
                fontWeight: "bold"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arr_TIME1,
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                min: function (value) {
                    return Math.floor(value.min)
                },
                max: function (value) {
                    return Math.ceil(value.max)
                }
            }],
            series: [
                {
                    name: '大氣溫度',
                    type: 'line',
                    data: arr_TEMP,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                },
                {
                    name: '露點溫度',
                    type: 'line',
                    data: arr_DewPoint,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                }
            ]
        };

        myChart.setOption(option)

        let option2 = {
            title: {
                text: '光照度監測',
                textStyle: {
                    color: 'red',
                },
                textAlign: 'auto'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const PAR = params[0] ? params[0].value : 'null ';
                    const SolarRad = params[1] ? params[1].value : 'null ';
                    return `光量子: ${PAR} μmol/㎡·s <br>太陽輻射: ${SolarRad} W/㎡`;
                },
                textStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: 14,
                }
            },
            legend: {
                data: ['光量子', '太陽輻射'],
                textStyle: {
                    color: 'black'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    saveAsImage: {}
                }
            },
            textStyle: {
                fontSize: 14,
                fontWeight: "bold"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arr_TIME1,
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                min: function (value) {
                    return Math.floor(value.min)
                },
                max: function (value) {
                    return Math.ceil(value.max)
                }
            }],
            series: [
                {
                    name: '光量子',
                    type: 'line',
                    data: arr_PAR,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                },
                {
                    name: '太陽輻射',
                    type: 'line',
                    data: arr_SolarRad,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                }
            ]
        };
        myChart2.setOption(option2)

        let option3 = {
            title: {
                text: '濕度監測',
                textStyle: {
                    color: 'red',
                },
                textAlign: 'auto'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const HUMD = params[0] ? params[0].value : 'null ';
                    const SoilMoisture = params[1] ? params[1].value : 'null ';
                    const LeafWet = params[2] ? params[2].value : 'null ';
                    return `相對濕度: ${HUMD}% <br>土壤濕度: ${SoilMoisture}% <br>葉片濕度: ${LeafWet}%`;
                },
                textStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: 14,
                }
            },
            legend: {
                data: ['相對濕度', '土壤濕度', '葉片濕度'],
                textStyle: {
                    color: 'black'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    saveAsImage: {}
                }
            },
            textStyle: {
                fontSize: 14,
                fontWeight: "bold"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arr_TIME1,
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                min: function (value) {
                    return Math.floor(value.min)
                },
                max: function (value) {
                    return Math.ceil(value.max)
                }
            }],
            series: [
                {
                    name: '相對濕度',
                    type: 'line',
                    data: arr_HUMD,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                },
                {
                    name: '土壤濕度',
                    type: 'line',
                    data: arr_SoilMoisture,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                },
                {
                    name: '葉片濕度',
                    type: 'line',
                    data: arr_LeafWet,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                }
            ]
        };
        myChart3.setOption(option3)

        let option4 = {
            title: {
                text: '風速降雨',
                textStyle: {
                    color: 'red',
                },
                textAlign: 'auto'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const wdsd = params[0] ? params[0].value : 'null ';
                    const h_fx = params[1] ? params[1].value : 'null ';
                    const rain = params[2] ? params[2].value : 'null ';
                    return `平均風速: ${wdsd}m/s <br>最大陣風: ${h_fx}m/s <br>降雨量: ${rain}mm`;
                },
                textStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: 14,
                }
            },
            legend: {
                data: ['平均風速', '最大陣風', '降雨量'],
                textStyle: {
                    color: 'black'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    saveAsImage: {}
                }
            },
            textStyle: {
                fontSize: 14,
                fontWeight: "bold"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arr_TIME1,
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                min: function (value) {
                    return Math.floor(value.min)
                },
                max: function (value) {
                    return Math.ceil(value.max)
                }
            }],

            series: [
                {
                    name: '平均風速',
                    type: 'bar',
                    data: arr_WDSD,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                },
                {
                    name: '最大陣風',
                    type: 'bar',
                    data: arr_H_FX,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                },
                {
                    name: '降雨量',
                    type: 'bar',
                    data: arr_RAIN,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' },
                        ]
                    }
                }

            ]
        };
        myChart4.setOption(option4)

        const convertedDirections = convertWindDirections(arr_WDIR);

        let option5 = {
            title: {
                text: '風向',
                textStyle: {
                    color: 'red',
                },
                textAlign: 'auto'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const direction = params[0].value;
                    const convertedDirection = convertedDirections[params[0].dataIndex];
                    return `方向角度: ${direction}°<br>方位: ${convertedDirection}`
                },
                textStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: 14,
                }
            },
            legend: {
                data: ['風向'],
                textStyle: {
                    color: 'black'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    saveAsImage: {}
                }
            },
            textStyle: {
                fontSize: 14,
                fontWeight: "bold"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arr_TIME1,
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: 'black'
                    }
                },
                min: function (value) {
                    return Math.floor(value.min)
                },
                max: function (value) {
                    return Math.ceil(value.max)
                }
            }],

            series: [
                {
                    name: '風向',
                    type: 'scatter',
                    data: arr_WDIR,
                },
            ]
        };
        myChart5.setOption(option5)

    })
};
$(document).ready(() => {
  getHistoryData('ligangChartV1', 'ligangChartV1');
  getHistoryData('ligangChartV2', 'ligangChartV2');
  getHistoryData('ligangChartV3', 'ligangChartV3');
  getHistoryData('ligangChartV5', 'ligangChartV5');
});

const processData = (rawdata) => {
  let ligangData = {
    "ESP8266-5a95ba": { "Time": [], "Temperature": [], "Humidity": [] },
    "ESP8266-52b7a0": { "Time": [], "Temperature": [], "Humidity": [] },
    "ESP8266-b0b23": { "Time": [], "Temperature": [], "Humidity": [] },
    "ESP8266-d51b32": { "Time": [], "Temperature": [], "Humidity": [] }
  };

  rawdata.forEach((item) => {
    switch(item.deviceID) {
      case 'ESP8266-5a95ba':
        if(item.deviceFeatureName === 'Temperature'){
          ligangData['ESP8266-5a95ba']['Time'].push(formatTime(item.time));
          ligangData['ESP8266-5a95ba']['Temperature'].push(item.value);
        } else if (item.deviceFeatureName === 'Humidity'){
          ligangData['ESP8266-5a95ba']['Humidity'].push(item.value);
        }
        break;
      case 'ESP8266-52b7a0':
        if(item.deviceFeatureName === 'Temperature'){
          ligangData['ESP8266-52b7a0']['Time'].push(formatTime(item.time));
          ligangData['ESP8266-52b7a0']['Temperature'].push(item.value);
        } else if (item.deviceFeatureName === 'Humidity'){
          ligangData['ESP8266-52b7a0']['Humidity'].push(item.value);
        }
        break;
      case 'ESP8266-b0b23':
        if(item.deviceFeatureName === 'Temperature'){
          ligangData['ESP8266-b0b23']['Time'].push(formatTime(item.time));
          ligangData['ESP8266-b0b23']['Temperature'].push(item.value);
        } else if (item.deviceFeatureName === 'Humidity'){
          ligangData['ESP8266-b0b23']['Humidity'].push(item.value);
        }
        break;
      case 'ESP8266-d51b32':
        if(item.deviceFeatureName === 'Temperature'){
          ligangData['ESP8266-d51b32']['Time'].push(formatTime(item.time));
          ligangData['ESP8266-d51b32']['Temperature'].push(item.value);
        } else if (item.deviceFeatureName === 'Humidity'){
          ligangData['ESP8266-d51b32']['Humidity'].push(item.value);
        }
        break;
    }
  });
  return ligangData;
};

const formatTime = (timeString) => {
    const time = new Date(timeString)
    const year = String(time.getFullYear());
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(Math.floor(time.getMinutes() / 10) * 10).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const drawHistoryChart = (title, ligangChart, xAxisData, yAxisTempData, yAxisHumdData) => {
  let option = {
    title: {
      text: title,
      textStyle: {
        color: 'red',
      },
      textAlign:'auto'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (param) => {
        const temp = param[0] ? param[0].value: 'null';
        const humd = param[0] ? param[0].value: 'null';
        return `溫度: ${temp} °C <br> 濕度: ${humd} %`;
      },
      textStyle: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,
      }
    },
    legend: {
      data: ['溫度', '濕度'],
      textStyle: {
        color: 'black'
      },
      bottom: '5%'
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: {readOnly: false},
        saveAsImage:{}
      }
    },
    textStyle: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xAxisData,
      axisLabel: {
        formatter: (value) => {
          return value.replace(' ', '\n')
        },
        textStyle:{
          color: 'black'
        }
      }
    },
    yAxis: [{
      type: 'value',
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color:'black'
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
        id: 'dataZoomX',
        type: 'inside',
      }
    ],
    series: [
      {
        name: '溫度',
        type: 'line',
        data: yAxisTempData,
        markPoint:{
          data: [
            { type: 'max', name: '最大值'},
            { type: 'min', name: '最小值'},
          ]
        }
      },
      {
        name: '濕度',
        type: 'line',
        data: yAxisHumdData,
        markPoint:{
          data: [
            { type: 'max', name: '最大值'},
            { type: 'min', name: '最小值'},
          ]
        }
      },
    ]
  };
  ligangChart.setOption(option);
};

const getHistoryData = (_chartName, _contentID) => {
  $("#container").empty();
  let days = Number($('#days').val());
  $.getJSON(`http://127.0.0.1:5000/api/ligang/history?days=${days}`, (rawdata) => {
      const processedData = processData(rawdata);
      console.log(processedData);

      _chartName = echarts.init($(`#${_contentID}`)[0]);
      window.onresize = () => {
        _chartName.resize();
      };
      
      xAxisData = processedData['ESP8266-5a95ba']['Time'];
      yAxisTempData = processedData['ESP8266-5a95ba']['Temperature'];
      yAxisHumdData = processedData['ESP8266-5a95ba']['Humidity'];
      drawHistoryChart('冷凍庫01', _chartName, xAxisData, yAxisTempData, yAxisHumdData);
      // let option = {
      //   title: {
      //     text: '冷凍庫01',
      //     textStyle: {
      //       color: 'red',
      //     },
      //     textAlign:'auto'
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     formatter: (param) => {
      //       const temp = param[0] ? param[0].value: 'null';
      //       const humd = param[0] ? param[0].value: 'null';
      //       return `溫度: ${temp} °C <br> 濕度: ${humd} %`;
      //     },
      //     textStyle: {
      //       color: 'red',
      //       fontWeight: 'bold',
      //       fontSize: 14,
      //     }
      //   },
      //   legend: {
      //     data: ['溫度', '濕度'],
      //     textStyle: {
      //       color: 'black'
      //     },
      //     bottom: '5%'
      //   },
      //   toolbox: {
      //     show: true,
      //     feature: {
      //       dataZoom: {
      //         yAxisIndex: 'none'
      //       },
      //       dataView: {readOnly: false},
      //       saveAsImage:{}
      //     }
      //   },
      //   textStyle: {
      //     fontSize: 14,
      //     fontWeight: 'bold'
      //   },
      //   xAxis: {
      //     type: 'category',
      //     boundaryGap: true,
      //     data: processedData['ESP8266-5a95ba']['Time'],
      //     axisLabel: {
      //       formatter: (value) => {
      //         return value.replace(' ', '\n')
      //       },
      //       textStyle:{
      //         color: 'black'
      //       }
      //     }
      //   },
      //   yAxis: [{
      //     type: 'value',
      //     axisLabel: {
      //       formatter: '{value}',
      //       textStyle: {
      //         color:'black'
      //       }
      //     },
      //     min: function (value) {
      //       return Math.floor(value.min)
      //     },
      //     max: function (value) {
      //         return Math.ceil(value.max)
      //     }
      //   }],
      //   dataZoom: [
      //     {
      //       id: 'dataZoomX',
      //       type: 'inside',
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '溫度',
      //       type: 'line',
      //       data: processedData['ESP8266-5a95ba']['Temperature'],
      //       markPoint:{
      //         data: [
      //           { type: 'max', name: '最大值'},
      //           { type: 'min', name: '最小值'},
      //         ]
      //       }
      //     },
      //     {
      //       name: '濕度',
      //       type: 'line',
      //       data: processedData['ESP8266-5a95ba']['Humidity'],
      //       markPoint:{
      //         data: [
      //           { type: 'max', name: '最大值'},
      //           { type: 'min', name: '最小值'},
      //         ]
      //       }
      //     },
      //   ]
      // };

      // ligangChartV1.setOption(option);

  }).fail((jqXHR, textStatus, errorThrown) => {
    console.error("getJSON failed: " + textStatus + ", " + errorThrown);
  })
};
$(document).ready(()=>{
    const updateTime =() => {
        let currentTime = new Date()
        let year = currentTime.getFullYear();
        let month = currentTime.getMonth() + 1;
        let day =  currentTime.getDate();
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();

        // 保持兩位數格式
        month = (month < 10 ? "0" : "") + month
        day = (day < 10 ? "0" : "") + day
        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        let dateString = `現在時間：${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        
        $('#current-time').text(dateString);
    }
    // 初始化日期和時間
    updateTime();

    //每秒更新日期和時間
    setInterval(updateTime, 1000);
});

// 添加點擊事件監聽器
$("#chart-button").click(function(event) {
    // 防止表單提交
    event.preventDefault();
  
    // 獲取當前URL
    let currentUrl = window.location.href;
  
    // 將當前URL傳遞給圖表頁面
    window.location.href = currentUrl + "/chart";
});

let gauge = new RadialGauge({
    renderTo: 'Radial-Gauge', // identifier of HTML canvas element or element itself
    width: 300,
    height: 300,
    units: 'μS/cm',
    title: 'EC',
    value: 0,
    minValue: 0,
    maxValue: 2,
    majorTicks: [
        '0','0.2','0.4','0.5','0.6','0.8','1.0','1.2','1.4','1.6','1.8','2'
    ],
    minorTicks: 2,
    strokeTicks: false,
    highlights: [
        { from: 0, to: 0.4, color: 'rgba(0, 183, 255, .7)' },
        { from: 0.4, to: 0.8, color: 'rgba(0, 81, 255, 0.7)' },
        { from: 0.8, to: 1.2, color: 'rgba(30, 255, 0, .25)' },
        { from: 1.2, to: 1.6, color: 'rgba(43, 255, 0, 0.705)' },
        { from: 1.6, to: 2, color: 'rgba(255,0, 0,.9)' }
    ],
    colorPlate: '#222',
    colorMajorTicks: '#f5f5f5',
    colorMinorTicks: '#ddd',
    colorTitle: '#fff',
    colorUnits: '#ccc',
    colorNumbers: '#eee',
    colorNeedleStart: 'rgba(240, 128, 128, 1)',
    colorNeedleEnd: 'rgba(255, 160, 122, .9)',
    valueBox: true,
    animationRule: 'linear'
}).draw();

let linearGauge = new LinearGauge({
    renderTo: 'Linear-gauge',
    width: 400,
    height: 300,
    units: "μS/cm",
    title: "EC",
    minValue: 0,
    maxValue: 2,
    majorTicks: [
        0,
        0.2,
        0.4,
        0.6,
        0.8,
        1,
        1.2,
        1.4,
        1.6,
        1.8,
        2
    ],
    minorTicks: 5,
    strokeTicks: true,
    ticksWidth: 15,
    ticksWidthMinor: 7.5,
    highlights: [
        {
            "from": 0,
            "to": 1,
            "color": "rgba(0,0, 255, .3)"
        },
        {
            "from": 1,
            "to": 2,
            "color": "rgba(255, 0, 0, .3)"
        }
    ],
    colorMajorTicks: "#ffe66a",
    colorMinorTicks: "#ffe66a",
    colorTitle: "black",
    colorUnits: "#17171a",
    colorNumbers: "black",
    colorPlate: "#b1abdf",
    colorPlateEnd: "#e92c25d8",
    borderShadowWidth: 0,
    borders: false,
    borderRadius: 10,
    needleType: "arrow",
    needleWidth: 3,
    animationDuration: 1500,
    animationRule: "linear",
    colorNeedle: "#222",
    colorNeedleEnd: "",
    colorBarProgress: "#ffc507",
    colorBar: "#f5f5f5",
    barStroke: 0,
    barWidth: 8,
    barBeginCircle: false
}).draw();

const socket = io().connect();
socket.on('EC-Value', (data) => {
    $('#EC-Value').html(`目前EC值：${data.msg}`);
    console.log('Received message:', data.msg);
    // 設定儀錶板的數值
    gauge.value = data.msg;
    linearGauge.value = data.msg;
});
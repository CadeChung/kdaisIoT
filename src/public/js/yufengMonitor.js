$(document).ready(() => {
    const createJustGage = (id, max, label) => {
        return new JustGage({
            id: id,
            value: 0,
            min: 0,
            max: max,
            decimals: 1,
            gaugeColor: "#edebeb",
            label: label,
            labelMinFontSize: 15,
            minLabelMinFontSize: 15,
            maxLabelMinFontSize: 15,
            labelFontColor: "#616060",
            valueFontColor: '#f78e04',
            gaugeWidthScale: 0.6,
            relativeGaugeSize: true
        })
    };

    let jg1 = createJustGage('jg1', '2', 'mS/cm');
    let jg2 = createJustGage('jg2', '40', '°C');
    let jg3 = createJustGage('jg3', '100', '%');

    const updateTime = () => {
        let currentTime = new Date()
        let year = currentTime.getFullYear();
        let month = currentTime.getMonth() + 1;
        let day = currentTime.getDate();
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();

        // 保持兩位數格式
        month = (month < 10 ? "0" : "") + month
        day = (day < 10 ? "0" : "") + day
        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        let dateString = `目前時間：${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

        $('#current-time').text(dateString);
    }

    let uploadTimeMappings = [
        { id: 1 },
        { id: 2 }
    ]

    let TempHumdECMappings = [
        { id: 1 },
        { id: 2 }
    ]

    const getYufengWeatherData = () => {
        $.getJSON('http://127.0.0.1:5000/api/last_data', (data) => {

            let previousDate = new Date(data.weatherData.TIME);
            let currentDate = new Date();
            let differenceInMinutes = (currentDate - previousDate) / (1000 * 60);

            let ecTime = new Date(data.ecData.time);
            let diffTimeInMinutes = (currentDate - ecTime) / (1000 * 60);
            $(`#lastUploadedTime3`).html(`上傳時間:${Math.round(diffTimeInMinutes)}分鐘前`);

            for (TempHumdECMapping of TempHumdECMappings) {
                $(`#current-TEMP${TempHumdECMapping.id}`).html(`${data.weatherData.TEMP}`);
                $(`#current-HUMD${TempHumdECMapping.id}`).html(`${data.weatherData.HUMD}`);
                $(`#current-EC${TempHumdECMapping.id}`).html(`${data.ecData.EC}`);
            };

            for (uploadTimeMapping of uploadTimeMappings) {
                $(`#lastUploadedTime${uploadTimeMapping.id}`).html(`上傳時間:${Math.round(differenceInMinutes)}分鐘前`);
            };

            $('#uploadtime').html(`${data.weatherData.TIME}`);
            $('#current-RAIN').html(`${data.weatherData.RAIN}`);
            $('#current-SoilMoisture').html(`${data.weatherData.SoilMoisture}`);
            $('#current-LeafWet').html(`${data.weatherData.LeafWet}`);
            $('#current-PAR').html(`${data.weatherData.PAR}`);
            $('#current-SolarRad').html(`${data.weatherData.SolarRad}`);
            $('#current-WDIR').html(`${data.weatherData.WDIR}`);
            $('#current-WDSD').html(`${data.weatherData.WDSD}`);
            $('#current-H_FX').html(`${data.weatherData.H_FX}`);
            $('#current-DewPoint').html(`${data.weatherData.DewPoint}`);
            jg1.refresh(data.ecData.EC_Gauge);
            jg2.refresh(data.weatherData.TEMP_Gauge);
            jg3.refresh(data.weatherData.HUMD_Gauge);
            console.log(data.ecData.EC);
            console.log(data.weatherData);

            $('#current-TEMP').html(`${data.weatherData.TEMP}`);
            $('#current-HUMD').html(`${data.weatherData.HUMD}`);
            $('#current-EC').html(`${data.ecData.EC}`);
            $('#current-TEMP-2').html(`${data.weatherData.TEMP}`);
            $('#current-HUMD-2').html(`${data.weatherData.HUMD}`);
            $('#current-EC-2').html(`${data.ecData.EC}`);
        })
    };

    // 初始化日期和時間
    updateTime();
    // 初始化讀取EC值
    getYufengWeatherData();

    // 每秒更新日期和時間
    setInterval(updateTime, 1000);
    // 每分鐘更新EC值
    setInterval(getYufengWeatherData, 10000);

});

// 添加點擊事件監聽器
$("#chart-button").click(function (event) {
    // 防止表單提交
    event.preventDefault();

    // 獲取當前URL
    let currentUrl = window.location.href;

    // 將當前URL傳遞給圖表頁面
    window.location.href = currentUrl + "/chart";
});
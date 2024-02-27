$(document).ready(() => {
  const formatTimeWithZero = (time) => {
    return (time < 10 ? "0" : "") + time;
  };

  const updateTime = () => {
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let month = formatTimeWithZero(currentTime.getMonth() + 1);
    let day = formatTimeWithZero(currentTime.getDate());
    let hours = formatTimeWithZero(currentTime.getHours());
    let minutes = formatTimeWithZero(currentTime.getMinutes());
    let seconds = formatTimeWithZero(currentTime.getSeconds());

    let timeString = `目前時間：${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    $('#ligang-currentTime').text(timeString);
  };

  const getLigangData = () => {
    $.getJSON("http://127.0.0.1:5000/api/ligang/latest", (data) => {
      console.log(data);
      $('#ligang-uploadTime').html(`${data.v2.time}`);
      $('#ligang-v2-temp').html(`${data.v2.temp} °C`);
      $('#ligang-v2-humd').html(`${data.v2.humd} %`);
      $('#ligang-v3-temp').html(`${data.v3.temp} °C`);
      $('#ligang-v3-humd').html(`${data.v3.humd} %`);
      $('#ligang-v5-temp').html(`${data.v5.temp} °C`);
      $('#ligang-v5-humd').html(`${data.v5.humd} %`);
      $('#ligang-v5-lux').html(`${data.v5.lux} lux`);
    });
  };

  updateTime();
  getLigangData();
  setInterval(updateTime, 1000);
  setInterval(getLigangData, 10000);
});
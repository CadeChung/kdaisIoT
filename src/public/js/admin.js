const sideMenu = document.querySelector('aside');
const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const themeToggler = document.querySelector(".theme-toggler");

// 側邊Siderbar的顯示與隱藏功能
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = '';
});

const isDarkMode = () => {
    return document.body.classList.contains('dark-theme-variables');
}

// 切換暗黑模式功能
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').
        classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').
        classList.toggle('active');
});

// 讀取目前的時間點
let today = new Date().toISOString().split('T')[0];
// 自動顯示時間到前端
let timeElement = document.getElementById('updateTime');
timeElement.textContent = `📅日期：${today}`

document.addEventListener("DOMContentLoaded", () => {
    let mainMenus = document.querySelectorAll('.main-menu');
    let subMenus = document.querySelectorAll('.sub-menu');
    let arrowIcons = document.querySelectorAll('.arrow-icon');

    mainMenus.forEach(menu => {
        menu.addEventListener('click', () => {
            let currentSubMenu = menu.nextElementSibling;
            let currentArrow = menu.querySelector('.arrow-icon');
            // 隱藏所有子選單
            subMenus.forEach(sub => {
                if (sub !== currentSubMenu) {
                    sub.style.display = 'none';
                }
            });
            // 移除主選單的active類別
            mainMenus.forEach(mainMenu => {
                mainMenu.classList.remove('active');
            });

            // 切換當下主選單的active狀態
            menu.classList.toggle('active', currentSubMenu.style.display !== 'block');
            // 重置所有箭頭方向
            arrowIcons.forEach(arrow => arrow.classList.remove('rotated'));
            // 切換目前子選單顯示狀態
            currentSubMenu.style.display = (currentSubMenu.style.display === 'block') ? 'none' : 'block';
            // 切換當前箭頭方向
            currentArrow.classList.toggle('rotated', currentSubMenu.style.display === 'block')
        });
    });

    // 獲取所有內容連結
    let contentLinks = document.querySelectorAll('.content-link');
    let contentSections = document.querySelectorAll('.content-section');

    // 為每個內容連結添加事件監聽器
    contentLinks.forEach(contentLink => {
        // 當用戶點擊連結時，執行以下操作
        contentLink.addEventListener('click', (e) => {
            // 阻止連結的默認行為
            e.preventDefault();

            // 隱藏所有其他內容區域
            contentLinks.forEach(innerLink => {
                if (innerLink !== contentLink) {
                    innerLink.classList.remove('active');
                }
            });

            const targetID = contentLink.getAttribute('data-target');
            const targetContent = document.getElementById(targetID);

            if (targetContent) {
                if (targetContent.style.display === 'block' || getComputedStyle(targetContent).display === 'block') {
                    targetContent.style.display = 'none';
                    contentLink.classList.remove('active');
                } else {
                    contentSections.forEach(section => section.style.display = 'none');
                    targetContent.style.display = 'block';
                    contentLink.classList.add('active');
                }
            }
        });
    });

    
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
    
    // 溫度儀錶板
    let jg_temp = createJustGage('jg_temp', '40', '°C');
    // 濕度儀錶板
    let jg_humd = createJustGage('jg_humd', '100', '%');
    // 溫度儀錶板2
    let jg_temp2 = createJustGage('jg_temp2', '40', '°C');
    // 濕度儀錶板2
    let jg_humd2 = createJustGage('jg_humd2', '100', '%');
    // 慶奇溫度儀錶板
    let kg_temp = createJustGage('kg_temp', '40', '°C');
    // 慶奇濕度儀錶板
    let kg_humd = createJustGage('kg_humd', '100', '%');
    // 慶奇土壤濕度儀錶板
    let kg_soilhumd = createJustGage('kg_soilhumd', '100', '%');
    // 慶奇光照度儀錶板
    let kg_lux = createJustGage('kg_lux', '100000', 'lux');

    const logout = async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
    
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('登出失敗');
            }
        } catch (err) {
            console.log('連接錯誤', err);
        }
    };
    document.getElementById('logout').addEventListener("click", logout)

    const calculateTimeDifference = (data) => {
        let previousDate = new Date(data);
        let currentDate = new Date();
        let differenceInMinutes = (currentDate - previousDate) / (1000 * 60)
        // 計算差異有多少小時
        let hours = Math.floor(differenceInMinutes / 60);
        // 計算除去小時後，還剩下的分鐘數
        let minutes = Math.floor(differenceInMinutes % 60);
        let result = "";

        // 如果有小時差異，則將小時數加入結果字串
        if (hours > 0) {
            result += `${hours}小時`
        }
        // 如果有分鐘差異，則將分鐘數加入結果字串
        if (minutes > 0) {
            // 如果已經有小時差異，則在小時和分鐘之間加入一個空格
            if (result) result += " ";
            result += `${minutes}分鐘前`
        }
        return result || "0分鐘";
    };

    const formatTime = (currentTime) => {
        let previousTime = new Date(currentTime);
        let year = previousTime.getFullYear();
        let month = previousTime.getMonth() + 1;
        let day = previousTime.getDate();
        let hours = previousTime.getHours();
        let minutes = previousTime.getMinutes();
        let seconds = previousTime.getSeconds();

        // Add leading zeros to single-digit numbers
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const PARMappings = [
        { id: '7', valueIndex: 21, voltIndex: 24 },
        { id: '8', valueIndex: 22, voltIndex: 25 },
        { id: '13', valueIndex: 23, voltIndex: 26 },
    ];

    const soilMappings = [
        { id: '1', tempIndex: 0, humdIndex: 6, ecIndex: 3, voltIndex: 15 },
        { id: '4', tempIndex: 1, humdIndex: 7, ecIndex: 4, voltIndex: 16 },
        { id: '14', tempIndex: 2, humdIndex: 8, ecIndex: 5, voltIndex: 17 }
    ];

    const tempHumdMappings = [
        { id: '9', tempIndex: 30, humdIndex: 35, voltIndex: 46 },
        { id: '10', tempIndex: 31, humdIndex: 49, voltIndex: 47 },
        { id: '11', tempIndex: 32, humdIndex: 50, voltIndex: 48 },
        { id: '12', tempIndex: 33, humdIndex: 51, voltIndex: 37 },
        { id: '17', tempIndex: 34, humdIndex: 52, voltIndex: 38 }
    ];

    const getChtData = () => {
        $.getJSON('http://127.0.0.1:5000/iot/admin/cht-data/latest', (data) => {

            for (let PARMapping of PARMappings) {
                $(`#current-PAR${PARMapping.id}`).html(`光輻照度:${data.value[PARMapping.valueIndex].value} W/m2`);
                $(`#current-Volt${PARMapping.id}`).html(`電池電壓:${data.value[PARMapping.voltIndex].value} V`);
                $(`#current-time${PARMapping.id}`).html(`上傳時間:${formatTime(data.value[PARMapping.valueIndex].time)}`);
                const timeDifferenceString = calculateTimeDifference(data.value[PARMapping.valueIndex].time);
                $(`#upload-time${PARMapping.id}`).html(`上傳時間:${timeDifferenceString}`);
            };

            for (let soilMapping of soilMappings) {
                $(`#current-SoilTEMP${soilMapping.id}`).html(`土壤溫度:${data.value[soilMapping.tempIndex].value}°C`);
                $(`#current-SoilHUMD${soilMapping.id}`).html(`土壤濕度:${data.value[soilMapping.humdIndex].value}%`);
                $(`#current-SoilEC${soilMapping.id}`).html(`土壤EC:${data.value[soilMapping.ecIndex].value}`);
                $(`#current-SoilVolt${soilMapping.id}`).html(`電池電壓:${data.value[soilMapping.voltIndex].value} V`);
                $(`#current-time${soilMapping.id}`).html(`上傳時間:${formatTime(data.value[soilMapping.tempIndex].time)}`);
                const timeDifferenceString = calculateTimeDifference(data.value[soilMapping.tempIndex].time);
                $(`#upload-time${soilMapping.id}`).html(`上傳時間:${timeDifferenceString}`);
            };

            for (let tempHumdMapping of tempHumdMappings) {
                $(`#current-temperature${tempHumdMapping.id}`).html(`環境溫度:${data.value[tempHumdMapping.tempIndex].value}°C`);
                $(`#current-humidity${tempHumdMapping.id}`).html(`環境濕度:${data.value[tempHumdMapping.humdIndex].value}%`);
                $(`#current-volt${tempHumdMapping.id}`).html(`電池電壓:${data.value[tempHumdMapping.voltIndex].value} V`);
                $(`#current-time${tempHumdMapping.id}`).html(`上傳時間:${formatTime(data.value[tempHumdMapping.tempIndex].time)}`);
                const timeDifferenceString = calculateTimeDifference(data.value[tempHumdMapping.tempIndex].time);
                $(`#upload-time${tempHumdMapping.id}`).html(`上傳時間:${timeDifferenceString}`);
            };
        });
    }
    let deviceData = {};
    const getHitikiData = () => {
        $.getJSON('http://127.0.0.1:5000/iot/admin/hitiki-data/latest', (data) => {
            deviceData = data;
        })
    }

    const $dropdown = $("main .user-orders ul");
    const $initItem = $dropdown.children('.init');
    const $otherItems = $dropdown.children('li:not(.init)');

    $initItem.on('click', () => {
        $otherItems.toggle();
    })

    $otherItems.on('click', (event) => {
        const deviceID = $(event.currentTarget).attr('data-value');
        getHitikiData();
        changeDeviceData(deviceID);
        $otherItems.removeClass('selected');
        $(event.currentTarget).addClass('selected');
        $initItem.html($(event.currentTarget).html());
        $otherItems.toggle();
    })

    const changeDeviceData = (deviceID) => {
        const data = deviceData[deviceID];
        let keys = Object.keys(data);
        let tableHtml = '';
        let units = ['', '°C', '%', 'lux',
            'hPa', '°C', '%', '°C',
            '%', 'mS/cm', '°C', '%',
            'mS/cm', 'V', 'µmol/㎡·s'];

        for (let i = 0; i < keys.length; i += 4) {
            tableHtml += '<thead>';
            for (let j = 0; j < 4 && i + j < keys.length; j++) {
                tableHtml += `<th>${keys[i + j]}</th>`
            }
            tableHtml += '</thead>'

            tableHtml += '<tbody>'
            for (let j = 0; j < 4 && i + j < keys.length; j++) {
                tableHtml += `<td>${data[keys[i + j]]} ${units[i + j]}</td>`
            }
            tableHtml += '</tbody>'
        }
        document.getElementById("dataTable").innerHTML = tableHtml;
    };

    const getCC22Data = () => {
        $.getJSON('http://127.0.0.1:5000/iot/admin/cc22-data/latest', (data) => {
            jg_temp.refresh(Number(data.temp));
            jg_humd.refresh(Number(data.humd));
            const timeDifferenceString = calculateTimeDifference(data.time)
            $(`#lastUploadedTimeCC22-1`).html(`上傳時間:${timeDifferenceString}`);
            $(`#lastUploadedTimeCC22-2`).html(`上傳時間:${timeDifferenceString}`);
            $(`#CC22-TEMP`).html(`${data.temp}°C`);
            $(`#CC22-HUMD`).html(`${data.humd}%`);
            console.log(data);
        })
    };

    const getMeinongData = () => {
        $.getJSON('http://127.0.0.1:5000/iot/admin/meinong-data/latest', (data) => {
            const meinongData = data.feeds[1];
            jg_temp2.refresh(Number(meinongData.field1));
            jg_humd2.refresh(Number(meinongData.field2));
            const timeDifferenceString = calculateTimeDifference(meinongData.created_at);
            $(`#lastUploadedTimeMeinong-1`).html(`上傳時間:${timeDifferenceString}`);
            $(`#lastUploadedTimeMeinong-2`).html(`上傳時間:${timeDifferenceString}`);
            $(`#MEINONG-TEMP`).html(`${meinongData.field1}°C`);
            $(`#MEINONG-HUMD`).html(`${meinongData.field2}%`);
            console.log(meinongData);
        })
    };

    const getKingkitData = () => {
        $.getJSON('http://127.0.0.1:5000/iot/admin/kingkit-data/latest', (data) => {
            kg_temp.refresh(Number(data.temp));
            kg_humd.refresh(Number(data.humd));
            kg_lux.refresh(Number(data.lux));
            kg_soilhumd.refresh(Number(data.soilHumd));
            const timeDifferenceString = calculateTimeDifference(data.time);
            $(`#lastUploadedTimeKingkit-1`).html(`上傳時間:${timeDifferenceString}`);
            $(`#lastUploadedTimeKingkit-2`).html(`上傳時間:${timeDifferenceString}`);
            $(`#lastUploadedTimeKingkit-3`).html(`上傳時間:${timeDifferenceString}`);
            $(`#lastUploadedTimeKingkit-4`).html(`上傳時間:${timeDifferenceString}`);
            $(`#KINGKIT-TEMP`).html(`${data.temp}°C`);
            $(`#KINGKIT-HUMD`).html(`${data.humd}%`);
            $(`#KINGKIT-SOILHUMD`).html(`${data.soilHumd}%`);
            $(`#KINGKIT-LUX`).html(`${data.lux}lux`);
        })
    };

    const getUserMessage = () => {
        $.getJSON('http://127.0.0.1:5000/iot/admin/message/all/users', (message) => {
            const userMessageElement = document.getElementById('user-message');
            userMessageElement.innerHTML = ''; // 清空原先的內容

            // tbody
            message.forEach(item => {
                let timestampUtc = new Date(item.createdAt);
                timestampUtc.setHours(timestampUtc.getHours() + 8);
                let formattedTimestamp = timestampUtc.toISOString().replace('T', " ").replace(/\.\d+Z/, "");
                console.log(formattedTimestamp)
                const tr = document.createElement('tr');
                const trContent = `
                    <td>${item.username}</td>
                    <td class="truncate">${item.email}</td>
                    <td>${item.role}</td>
                    <td>${formattedTimestamp}</td>
                `;
                tr.innerHTML = trContent;
                userMessageElement.appendChild(tr);
            })
        })
    };

    // 點擊按鈕後顯示
    document.getElementById('loadUserMessage').addEventListener('click', getUserMessage);

    const functionsConfig = [
        { func: getCC22Data, interval: 10000 },
        { func: getChtData, interval: 10000 },
        { func: getMeinongData, interval: 10000 },
        { func: getKingkitData, interval: 10000 }
    ];

    functionsConfig.forEach(item => {
        setInterval(item.func, item.interval);
    });

    const {ref, onMounted} = Vue;
    const app = Vue.createApp({
        setup() {
            const currentPassword = ref('');
            const newPassword = ref('');
            const confirmPassword = ref('');
            const message = ref('');
            const messageColor = ref('');

            const clearPasswd = () => {
                currentPassword.value = '';
                newPassword.value = '';
                confirmPassword.value = '';
            };

            const changePassword = async() => {
                if (currentPassword.value === newPassword.value) {
                    message.value = `新密碼與舊密碼不能相同`;
                    messageColor.value = 'red';
                    clearPasswd();
                    return;
                } else if (newPassword.value !== confirmPassword.value) {
                    message.value = `新密碼與確認密碼不相符`;
                    messageColor.value = 'red';
                    clearPasswd();
                    return;
                } else if (newPassword.value.trim() === '' || newPassword.value.length <= 8) {
                    message.value = `密碼不可為空白或小於8個字元`;
                    messageColor.value = 'red';
                    clearPasswd();
                    return;
                };
                try {
                    const response = await fetch('/iot/admin/api/change-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            currentPassword: currentPassword.value,
                            newPassword: newPassword.value,
                        }),
                    });

                    const data = await response.json();
                    message.value = data.message;
                    messageColor.value = data.success ? 'green' : 'red';
                    clearPasswd();
                } catch (err) {
                    console.error('錯誤:', err);
                    message.value = '發生錯誤';
                    messageColor.value = 'red';
                }
            }

            return {
                currentPassword,
                newPassword,
                confirmPassword,
                message,
                messageColor,
                changePassword,
            };
        },
    });
    app.mount('#app');
});
$(document).ready(() => {
    $('#login-container').submit((event) => {
        event.preventDefault(); // 防止表單提交
        const username = $('#username').val();
        const password = $('#password').val();
        console.log(username)
        console.log(password)
        $.ajax({
            url: 'login', // 請求的URL
            type: 'POST', // 請求的類型
            data: { // 要傳遞的數據
                username,
                password
            },
            success: (response) => { // 請求成功時的回調函數
                console.log(response.message)
                if (response.success) {
                    $('#login-message').html('登入成功'); // 顯示登入成功的訊息
                } else {
                    alert(response.message);
                    $('#login-message').html('登入失敗，請重新嘗試一次!'); // 顯示登入失敗的訊息
                }
            },
            error: () => { // 請求失敗時的回調函數
                $('#login-message').html('發生錯誤。 請稍後再試。'); // 顯示錯誤訊息
            }
        });
    });
});
if (localStorage['tokenUserId'] != null) {                  //если токен уже есть перебрасываем в чат
    window.location.href = "http://chat.loc/profile";
}

// обработчик нажатия кнопки "авторизоваться"
$('button[id="login-btn"]').click(function (e) {

    e.preventDefault();

    $(`input`).removeClass('error');

    let login = $('input[name ="login"]').val();
    let password = $('input[name ="password"]').val();

    $.ajax({                                                //запрос на получение записи из базы данных
        url: 'http://chat.loc/user_api/includes/signin',
        type: 'POST',
        dataType: 'json',
        data: {
            login: login,
            password: password
        },

        success(data) {

            if (data.status) {
                document.location.href = '/profile';        //переброс на чат
                localStorage.setItem('tokenUserId', data.Id);
            } else {
                if (data.type === 1) {
                    data.fields.forEach(function (field) {
                        $(`input[name='${field}']`).addClass('error')
                    });
                }

                $('.message').removeClass('none').text(data.message);
            }
        }
    });
});

//обработчик нажатия кнопки "зарегистрироваться"
$('button[id="reg-btn"]').click(function (e) {

    e.preventDefault();

    $(`input`).removeClass('error');

    let fullName = $('input[name ="fullName"]').val();
    let email = $('input[name ="email"]').val();
    let login = $('input[name ="login"]').val();
    let password = $('input[name ="password"]').val();
    let password_confirm = $('input[name ="password_confirm"]').val();

    $.ajax({                                                //запрос на получение записи из базы данных
        url: 'http://chat.loc/user_api/includes/signup',
        type: 'POST',
        dataType: 'json',
        data: {
            login: login,
            password: password,
            fullName: fullName,
            email: email,
            password_confirm: password_confirm
        },

        success(data) {

            if (data.status) {
                document.location.href = '/authorise';        //переброс на форму авторизации
            } else {
                if (data.type === 1) {
                    data.fields.forEach(function (field) {
                        $(`input[name='${field}']`).addClass('error')
                    });
                }

                $('.message').removeClass('none').text(data.message);
            }
        }
    });
});
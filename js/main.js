if (localStorage['tokenUserId'] != null) {
    window.location.href = "http://chat.loc/profile";
}

// autorise
$('button[id="login-btn"]').click(function (e) {

    e.preventDefault();

    $(`input`).removeClass('error');

    let login = $('input[name ="login"]').val();
    let password = $('input[name ="password"]').val();

    $.ajax({
        url: 'http://users.api.loc/includes/signin',
        type: 'POST',
        dataType: 'json',
        data: {
            login: login,
            password: password
        },

        success(data) {

            if (data.status) {
                document.location.href = '/profile';
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

//registration

$('button[id="reg-btn"]').click(function (e) {

    e.preventDefault();

    $(`input`).removeClass('error');

    let fullName = $('input[name ="fullName"]').val();
    let email = $('input[name ="email"]').val();
    let login = $('input[name ="login"]').val();
    let password = $('input[name ="password"]').val();
    let password_confirm = $('input[name ="password_confirm"]').val();

    $.ajax({
        url: 'http://users.api.loc/includes/signup',
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
                document.location.href = '/authorise';
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

/*
const chatEl = document.getElementById("chat");
const ws = new WebSocket("ws://localhost:2346");
ws.onmessage = (message) => {
    let messages = JSON.parse(message.data);
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${messages.name}: ${messages.message}`));
    chat.appendChild(messageEl);
}
const send = (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    ws.send(JSON.stringify({
        name, message
    }))
    return false;
}
const formEl = document.getElementById("messageForm");
formEl.addEventListener("submit", send);*/

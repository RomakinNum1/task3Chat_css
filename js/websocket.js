let name, count = 0;

//Создание WebSocket
const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

//Обработчик закрытия вкладки/страницы
window.onunload = function () {
    sendUnconnect("removeUser");                    //отправка остальным пользователям об отключении пользователя
};

//Обработчик создания WebSocket
ws.onopen = (event) => {
    if (localStorage['tokenUserId'] == null) {
        ws.close();
        return;
    }
    requestForGetMessages(count);                       //подгрузка сообщений для только подключившегося пользователя
    requestForGetName(localStorage['tokenUserId']);     //запрос на получение логина пользователя из токена
}


//Обработчик получения сообщения из сервера
ws.onmessage = (message) => {
    const answer = JSON.parse(message.data);
    if (answer.type === "addUser" || answer.type === "removeUser") {
        refreshUsers(answer);                           //обновление списка онлайн пользователей
    }
    printMessage(answer);                               //отрисовка сообщения
}

//Обработчик прокрутки страницы сообщений на самый верх(пагинация)
document.getElementById("chat").addEventListener('scroll', function () {
    if (document.getElementById("chat").scrollTop < 1) {
        count += 1;
        requestForGetMessages(count);                   //подгрузка сообщений для пользователя, который долистал вверх(пагинация)
    }
});

//обработчик нажатия кнопки "отправить"
const send = (event) => {
    event.preventDefault();
    const message = document.getElementById("message-text").value;

    if (message === '') return;

    document.getElementById("message-text").value = '';
    let type = 'sendMessage';
    let time = getTime();
    ws.send(JSON.stringify({
        name, message, type, time
    }))

    requestToDB(name, message, time);                    //добавление сообщения в базу данных

    return false;
}

//обработчик нажатия кнопки выход
const logout = (event) => {
    event.preventDefault();

    sendUnconnect("removeUser");                    //отправка остальным пользователям об отключении пользователя

    localStorage.removeItem('tokenUserId');
    window.location.href = "/";
    return false;
}

let formEl = document.getElementById("chat-form");//добавление функций на кнопки
formEl.addEventListener("submit", send);

formEl = document.getElementById("users-form"); //добавление функций на кнопки
formEl.addEventListener("submit", logout);

//функция отрисовки сообщения
function printMessage(answer) {
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${answer.name}: ${answer.message}`));

    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.style.fontSize = '10px';
    div.appendChild(document.createTextNode(`${answer.time}`));

    chat.appendChild(div);

    chat.appendChild(messageEl);
    chat.scrollTo(0, chat.scrollHeight);
}

//(пагинация)функция отрисовки сообщений в самом начале страницы
function printMessageFromDB(answer) {
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${answer.name}: ${answer.message}`));

    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.style.fontSize = '10px';
    div.appendChild(document.createTextNode(`${answer.time}`));

    chat.insertBefore(messageEl, chat.firstChild);
    chat.insertBefore(div, chat.firstChild);
}

//функция добавления сообщения в базу данных
function requestToDB(name, message, time) {
    $.ajax({
        url: 'http://chat.loc/chat_api/includes/addMessage',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            message: message,
            name: name,
            time: time,
            token: localStorage['tokenUserId']
        }
    });
}

//функция получения логина пользователя из токена
function requestForGetName(token) {
    $.ajax({
        url: 'http://chat.loc/chat_api/includes/getToken',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            token: token
        },
        success(data) {                                 //отправка сообщения о новом подключении всем пользователя
            if (data.status) {
                name = data.login;
                const message = " присоединяется к чату...";
                const type = "addUser";
                let time = getTime();
                ws.send(JSON.stringify({
                    name, message, type, time
                }))
            } else {
                document.location.href = '/';
            }
        }
    });
}

//функция получения сообщений из базы данных
function requestForGetMessages(count) {
    $.ajax({
        url: 'http://chat.loc/chat_api/includes/getMessage',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            count: count,
            token: localStorage['tokenUserId']
        },
        success(data) {                                 //прорисовка каждого сообщения(по умолчанию 50)
            for (let i = 0; i < data.length; i++) {
                printMessageFromDB(data[i]);
            }
        }
    });
}

//функция обновления списка пользователей онлайн
function refreshUsers(answer) {
    while (users.firstChild) {
        users.removeChild(users.firstChild);
    }

    for (let user in answer.usersArr) {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${answer.usersArr[user]}`));
        users.appendChild(messageEl);
        users.scrollTo(0, users.scrollHeight);
    }
}

//функция получения текущего времени
function getTime() {
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    //return new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear() + ' : ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    return new Date().toLocaleString("ru", options);
}

//функция отправки сообщения об отключении пользователя
function sendUnconnect(type) {
    const message = " отключается...";
    let time = getTime();
    ws.send(JSON.stringify({
        name, message, type, time
    }))
    ws.close();
}
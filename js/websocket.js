let name, count = 0;
let messages = [];

const ws = new WebSocket("ws://localhost:2346");

window.onunload = function () {
    sendUnconnect("noRemoveUser");
};

document.getElementById("chat").addEventListener('scroll', function() {
    if (document.getElementById("chat").scrollTop < 1) {
        count+=1;
        requestForGetMessages(count);
    }
});

ws.onopen = (event) => {
    if(localStorage['tokenUserId']==null){
        ws.close();
        return;
    }
    requestForGetMessages(count);
    requestForGetName(localStorage['tokenUserId']);
}

ws.onmessage = (message) => {
    const answer = JSON.parse(message.data);
    if (answer.type === "addUser" || answer.type === "removeUser") {
        refreshUsers(answer);
    }
    printMessage(answer);
}

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

    requestToDB(name, message, time);

    return false;
}

const logout = (event) => {
    event.preventDefault();

    sendUnconnect("removeUser");

    localStorage.removeItem('tokenUserId');
    window.location.href = "http://chat.loc/";
    return false;
}

let formEl = document.getElementById("chat-form");
formEl.addEventListener("submit", send);

formEl = document.getElementById("users-form");
formEl.addEventListener("submit", logout);

function printMessage(answer) {
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${answer.name}: ${answer.message}`));

    const div = document.createElement('div');
    div.style.textAlign='center'; div.style.fontSize = '10px';
    div.appendChild(document.createTextNode(`${answer.time}`));

    chat.appendChild(div);

    chat.appendChild(messageEl);
    chat.scrollTo(0, chat.scrollHeight);
}

function printMessageFromDB(answer) {
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${answer.name}: ${answer.message}`));

    const div = document.createElement('div');
    div.style.textAlign='center'; div.style.fontSize = '10px';
    div.appendChild(document.createTextNode(`${answer.time}`));

    chat.insertBefore(messageEl, chat.firstChild);
    chat.insertBefore(div, chat.firstChild);
}

function requestToDB(name, message, time) {
    $.ajax({
        url: 'http://chat.api.loc/includes/addMessage',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            message: message,
            name: name,
            time: time
        }
    });
}

function requestForGetName(token) {
    $.ajax({
        url: 'http://chat.api.loc/includes/getToken',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            token: token
        },
        success(data) {
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

function requestForGetMessages(count) {
    $.ajax({
        url: 'http://chat.api.loc/includes/getMessage',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {
            count: count
        },
        success(data) {
            for (let i = 0; i < data.length; i++) {
                printMessageFromDB(data[i]);
            }
        }
    });
}

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

function getTime(){
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

function sendUnconnect(type){
    const message = " отключается...";
    let time = getTime();
    ws.send(JSON.stringify({
        name, message, type, time
    }))
    ws.close();
}
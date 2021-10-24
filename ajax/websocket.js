let name;
let messages = [];
const chatEl = document.getElementById("chat");
const ws = new WebSocket("ws://localhost:2346");

window.onbeforeunload = function() {
    const message = " отключается...";
    const type = "removeUser";
    ws.send(JSON.stringify({
        name, message, type
    }))
    ws.close();
};

ws.onopen = (event) => {
    const searchString = new URLSearchParams(window.location.search);
    const token = searchString.get('token');
    requestForGetName(token);
    requestForGetMessages(token);
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

    requestToDB(name, message);

    document.getElementById("message-text").value = '';
    let type = 'sendMessage';
    ws.send(JSON.stringify({
        name, message, type
    }))
    return false;
}

const logout = (event) => {
    event.preventDefault();
    const message = " отключается...";
    const type = "removeUser";
    ws.send(JSON.stringify({
        name, message, type
    }))
    ws.close();
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
    chat.appendChild(messageEl);
    chat.scrollTo(0, chat.scrollHeight);
}

function requestToDB(name, message) {
    $.ajax({
        url: 'http://chat.api.loc/includes/addMessage',
        type: 'POST',
        dataType: 'json',
        data: {
            message: message,
            name: name
        }
    });
}

function requestForGetName(token) {
    $.ajax({
        url: 'http://chat.api.loc/includes/getToken',
        type: 'POST',
        dataType: 'json',
        data: {
            token: token
        },
        success(data) {
            if (data.status) {
                name = data.fullName;
                const message = " присоединяется к чату...";
                const type = "addUser";
                ws.send(JSON.stringify({
                    name, message, type
                }))
            } else {
                document.location.href = '/';
            }
        }
    });
}

function requestForGetMessages() {
    $.ajax({
        url: 'http://chat.api.loc/includes/getMessage',
        type: 'POST',
        dataType: 'json',
        success(data) {
            for (let i = 0; i < data.length; i++)
            {
                printMessage(data[i]);
            }
        }
    });
}

function refreshUsers(answer) {
    while (users.firstChild) {
        users.removeChild(users.firstChild);
    }

    for(let user in answer.usersArr) {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${answer.usersArr[user]}`));
        users.appendChild(messageEl);
        users.scrollTo(0, users.scrollHeight);
    }
}
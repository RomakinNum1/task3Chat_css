<?php

use Roman\Func\ConnectToDB;
use Roman\Func\dataBaseEditor;

const SELECT_USER = "SELECT * FROM `users` WHERE login = :login";
const ERROR_ON_INPUTS = 1;

$dataBaseConnect = ConnectToDB::connect();

if (dataBaseEditor::SelectLogin($dataBaseConnect,$_POST,SELECT_USER)){//($user) {
    $response = [
        "status" => false,
        "type" => ERROR_ON_INPUTS,
        "message" => "Пользователь с таким логином уже существует!",
        "fields" => ['login']
    ];

    echo json_encode($response);
    die();
}

$errorFields = [];

if ($_POST['login'] === '') {
    $errorFields[] = 'login';
}
if ($_POST['password'] === '') {
    $errorFields[] = 'password';
}
if ($_POST['fullName'] === '') {
    $errorFields[] = 'fullName';
}
if ($_POST['email'] === '' || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errorFields[] = 'email';
}
if ($_POST['password_confirm'] === '') {
    $errorFields[] = 'password_confirm';
}

if (!empty($errorFields)) {
    $response = [
        "status" => false,
        "type" => ERROR_ON_INPUTS,
        "message" => "Проверьте правильность полей",
        "fields" => $errorFields
    ];

    echo json_encode($response);
    die();
}

if ($_POST['password'] != $_POST['password_confirm']) {
    $response = [
        "status" => false,
        "type" => ERROR_ON_INPUTS,
        "message" => "Пароли не совпадают!",
        "fields" => ['password', 'password_confirm']
    ];
    echo json_encode($response);
}

if ($_POST['password'] === $_POST['password_confirm']) {

    //_POST['password'] = md5($_POST['password']);

    dataBaseEditor::addUser($dataBaseConnect, $_POST);

    $response = [
        "status" => true,
        "message" => "Регистрация прошла успешно!"
    ];

    echo json_encode($response);
}
?>
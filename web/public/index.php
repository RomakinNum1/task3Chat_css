<?php

use Firebase\JWT\JWT;
use Roman\Func\ConnectToDB;
use Roman\Func\dataBaseEditor;

require '../../composer/vendor/autoload.php';

use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\HttpFoundation\Request;

$dataBaseConnect = ConnectToDB::connect();

try {
    $routes = new RouteCollection();

    $routes->add('getUserId', new Route('/users/{id}', [], ['id'=>'[0-9]+']));
    $routes->add('getUsers', new Route('/users'));
    $routes->add('confirmUser', new Route('/confirm/{token}'));

    $routes->add('chooseUser', new Route('/'));
    $routes->add('cssStyle', new Route('/css/main.css'));
    $routes->add('register', new Route('/register'));
    $routes->add('authorise', new Route('/authorise'));
    $routes->add('signIn', new Route('/includes/signin'));
    $routes->add('signUp', new Route('/includes/signup'));
    $routes->add('ajax', new Route('/js/main.js'));
    $routes->add('jquery', new Route('/js/http_code.jquery.com_jquery-3.6.0'));
    $routes->add('profile', new Route('/profile'));

    $context = new RequestContext();
    $context->fromRequest(Request::createFromGlobals());

    $matcher = new UrlMatcher($routes, $context);
    $parameters = $matcher->match($context->getPathInfo());

    if ($parameters['_route'] == 'chooseUser') {
        require_once '../templates/index-temp.html';
        return;
    }

    if ($parameters['_route'] == 'ajax') {
        require_once '../ajax/main.js';
        return;
    }

    if ($parameters['_route'] == 'jquery') {
        require_once '../ajax/http_code.jquery.com_jquery-3.6.0';
        return;
    }

    if ($parameters['_route'] == 'cssStyle') {
        require_once '../css/main.css';
        return;
    }

    if ($parameters['_route'] == 'register') {
        require_once '../templates/register-temp.html';
        return;
    }

    if ($parameters['_route'] == 'authorise') {
        require_once '../templates/authorise-temp.html';
        return;
    }

    if ($parameters['_route'] == 'signIn') {
        require_once '../includes/signin.php';
        return;
    }

    if ($parameters['_route'] == 'signUp') {
        require_once '../includes/signup.php';
        return;
    }

    if ($parameters['_route'] == 'profile') {
        require_once '../templates/profile-temp.html';
        return;
    }

    if ($parameters['_route'] == 'confirmUser') {
        $decoded = JWT::decode($parameters['token'], $_ENV['JWT_KEY'], array('HS256'));

        if (dataBaseEditor::confirmEmail($dataBaseConnect, $decoded->id)) {
            dataBaseEditor::echoResults('Email confirmed', 200);
            return;
        } else {
            if ($decoded->time < time()) {
                dataBaseEditor::deleteInactiveUsers($dataBaseConnect, $decoded->id);
                dataBaseEditor::echoResults('Address not found', 404);
                return;
            } else {
                dataBaseEditor::echoResults('The address is invalid', 404);
            }
        }
        return;
    }
    if (!isset($parameters['id'])) {
        if ($context->getMethod() == 'GET') {
            dataBaseEditor::getUsers($dataBaseConnect);
            return;
        }

        if ($context->getMethod() == 'POST') {
            $data = file_get_contents('php://input');
            $data = json_decode($data, true);

            dataBaseEditor::addUser($dataBaseConnect, $data);
            return;
        }

        dataBaseEditor::echoResults('The request is incorrect', 400);
        return;
    }

    if ($context->getMethod() == 'GET') {
        dataBaseEditor::getUser($dataBaseConnect, $parameters['id']);
        return;
    }

    if ($context->getMethod() == 'PUT') {
        $data = file_get_contents('php://input');
        $data = json_decode($data, true);

        dataBaseEditor::updateUser($dataBaseConnect, $parameters['id'], $data);
        return;
    }

    if ($context->getMethod() == 'DELETE') {
        dataBaseEditor::deleteUser($dataBaseConnect, $parameters['id']);
        return;
    }

    dataBaseEditor::echoResults('The request is incorrect', 400);
} catch (ResourceNotFoundException $ex) {
    dataBaseEditor::echoResults('The request is incorrect', 400);
}
<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

require 'composer/vendor/autoload.php';

try {
    $routes = new RouteCollection();

    $routes->add('chooseUser', new Route('/'));             //начальная страница
    $routes->add('register', new Route('/register'));       //форма регистрации
    $routes->add('authorise', new Route('/authorise'));     //форма авторизации
    $routes->add('profile', new Route('/profile'));         //форма чата

    $context = new RequestContext();
    $context->fromRequest(Request::createFromGlobals());

    $matcher = new UrlMatcher($routes, $context);
    $parameters = $matcher->match($context->getPathInfo());

    if ($parameters['_route'] == 'chooseUser') {
        require_once 'templates/index-temp.html';
        return;
    }

    if ($parameters['_route'] == 'register') {
        require_once 'templates/register-temp.html';
        return;
    }

    if ($parameters['_route'] == 'authorise') {
        require_once 'templates/authorise-temp.html';
        return;
    }

    if ($parameters['_route'] == 'profile') {
        echo "<script>window.WEBSOCKET_CONNECTION_URL = '{$_ENV['WEBSOCKET_CONNECTION_URL']}'</script>";//подключение переменной окружения
        require_once 'templates/profile-temp.html';
        return;
    }
} catch (ResourceNotFoundException $ex) {
    echo 'The request is incorrect';
    http_response_code(400);
}

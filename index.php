<?php

use Firebase\JWT\JWT;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

require 'composer/vendor/autoload.php';

try {
    $routes = new RouteCollection();

    $routes->add('chooseUser', new Route('/'));
    $routes->add('register', new Route('/register'));
    $routes->add('authorise', new Route('/authorise'));
    $routes->add('profile', new Route('/profile'));

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
        require_once 'templates/profile-temp.html';
        return;
    }
} catch (ResourceNotFoundException $ex) {
    echo 'The request is incorrect';
    http_response_code(400);
}

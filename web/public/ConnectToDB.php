<?php

namespace Roman\Func;

use PDO;
use PDOException;

class ConnectToDB
{
    static private $connection = null;

    static function connect()
    {
        try {
            if (self::$connection === null) {
                $config = ['host' => $_ENV["MYSQL_HOST"],
                    'db_name' => $_ENV["MYSQL_DATABASE"],
                    'username' => $_ENV["MYSQL_USER"],
                    'password' => $_ENV["MYSQL_PASSWORD"]
                ];
                self::$connection = new PDO('mysql:host=' . $config['host'] . ';dbname=' . $config['db_name'], $config['username'], $config['password']);
            }
            return self::$connection;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die();
        }
    }
}


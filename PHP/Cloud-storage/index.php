<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/constants.php';
require_once CONF . '/func.php';

use controllers\Router;

$router = new Router();
require_once CONF . '/routes.php';

<?php

namespace controllers;

class Router
{
    public array $routes = [];
    protected string $url;
    protected string $path;

    public function __construct()
    {
        $this->url = $_GET['url'] ?? '';
    }

    public function mutch(): void
    {
        $checkUrl = false;
        foreach ($this->routes as $route) {
            if ($route['url'] === $this->url) {
                require_once CONTROLLERS . $route['path'] . $route['controller'];
                $checkUrl = true;               
            }
        }
        if (!$checkUrl) {            
            infoWindow('Ошибка 404', 'Такой страницы не существует');
        }
    }

    private function add($url, $Controller, $path): void
    {
        $this->routes[] = [
            'url' => $url,
            'controller' => $Controller,
            'path' => $path,
        ];
    }

    public function route($url, $controller, $path): void
    {
        $this->add($url, $controller, $path);
    }
}

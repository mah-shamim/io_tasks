<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return response()
            ->view('app')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    public function testView(): Response|Application|ResponseFactory
    {
        return response(config('app.name') . ' API ' . config('app.version'), 200)
            ->header('Content-Type', 'text/plain');
    }
}

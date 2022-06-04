<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * public routes
 */
Route::post('auth/user/login', [AuthController::class, 'userLogin'])->name('auth.login');

Route::post('auth/user/register', [AuthController::class, 'userRegister'])->name('auth.register');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('auth/user', [AuthController::class, 'getCurrentUser'])->name('auth.current.user');
    Route::get('auth/logout', [AuthController::class, 'userLogout'])->name('auth.user.logout');

    Route::apiResource('/tasks', TaskController::class)->names('tasks');
    Route::apiResource('/users', UserController::class);
});

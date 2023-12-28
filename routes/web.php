<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('login');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/profiles', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/user-create', [UserController::class, 'create'])->name('user.create');
    Route::post('/user-store', [UserController::class, 'store'])->name('user.store');
    Route::get('/users-edit/{id}', [UserController::class, 'edit'])->name('user.edit');
    Route::post('/users-update/{id}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/delete-users/{id}', [UserController::class, 'destroy'])->name('user.destroy');
    Route::get('/user-export', [UserController::class, 'exportData'])->name('users.export');

    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/role-create', [RoleController::class, 'create'])->name('role.create');
    Route::put('/role-store', [RoleController::class, 'store'])->name('role.store');
    Route::get('/roles-edit/{id}', [RoleController::class, 'edit'])->name('role.edit');
    Route::put('/roles-update/{id}', [RoleController::class, 'update'])->name('role.update');
    Route::delete('/delete-roles/{id}', [RoleController::class, 'destroy'])->name('role.destroy');
});

require __DIR__ . '/auth.php';

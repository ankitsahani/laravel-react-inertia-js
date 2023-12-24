<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $data['totalUsers'] = User::count();
        return Inertia::render('Dashboard', $data);
    }
}

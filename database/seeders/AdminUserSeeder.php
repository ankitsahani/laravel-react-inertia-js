<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@gmail.com')->first();

        if (is_null($admin)) {
        User::create([
            'role_id' => 1,
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'pic' => 'default.png',
            'password' => bcrypt('123456'),
        ]);
    }
    }
}

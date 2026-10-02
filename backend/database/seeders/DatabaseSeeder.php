<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'StockPilot Admin',
            'email' => env('ADMIN_EMAIL', 'admin@stockpilot.test'),
            'password' => Hash::make(
                env('ADMIN_PASSWORD', 'change-me')
            ),
            'role' => 'admin',
        ]);
    }
}
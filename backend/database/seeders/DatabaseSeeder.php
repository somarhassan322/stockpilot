<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL');
        $adminPassword = env('ADMIN_PASSWORD');

        if (! $adminEmail || ! $adminPassword) {
            throw new RuntimeException(
                'ADMIN_EMAIL and ADMIN_PASSWORD must be configured in the environment.'
            );
        }

        User::updateOrCreate(
            [
                'email' => $adminEmail,
            ],
            [
                'name' => 'StockPilot Admin',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
            ]
        );
    }
}
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Stas Pogorskii',
                'email' => 'stanislav.pogorskii@gmail.com',
                'email_verified_at' => now(),
                'password' => bcrypt('Pa$$w0rd!'),
            ],
            [
                'name' => 'Kirill Pronin',
                'email' => 'procake@icloud.com',
                'email_verified_at' => now(),
                'password' => bcrypt('Pa$$w0rd!'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}

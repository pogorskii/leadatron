<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Lead::factory(50)->create();
    }
}

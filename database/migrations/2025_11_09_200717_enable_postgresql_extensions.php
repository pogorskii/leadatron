<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enable PostgreSQL extensions for fuzzy matching and geospatial queries
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE EXTENSION IF NOT EXISTS fuzzystrmatch');
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP EXTENSION IF EXISTS postgis');
        DB::statement('DROP EXTENSION IF EXISTS fuzzystrmatch');
        DB::statement('DROP EXTENSION IF EXISTS pg_trgm');
    }
};

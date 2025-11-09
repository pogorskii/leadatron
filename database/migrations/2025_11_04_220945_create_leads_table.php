<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', static function (Blueprint $table) {
            $table->id();

            // Basic business info
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('city')->nullable()->index();
            $table->string('postal_code', 10)->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();

            // Normalized fields for deduplication
            $table->string('name_normalized')->index();
            $table->string('phone_normalized')->nullable()->index();
            $table->string('website_normalized')->nullable();

            // Website & social
            $table->string('website_url')->nullable();
            $table->string('instagram_handle')->nullable();
            $table->unsignedInteger('instagram_followers')->nullable();
            $table->string('facebook_url')->nullable();

            // Google data
            $table->string('google_maps_url')->nullable();
            $table->float('google_rating')->nullable();
            $table->unsignedInteger('google_reviews_count')->nullable();

            // Classification
            $table->string('business_category')->nullable();
            $table->string('industry_classification')->nullable()->index();
            $table->string('scope')->default('Small')->index(); // Small, Medium, Corporate

            // Source tracking - stores JSON array of sources
            $table->json('sources')->nullable();

            // Status tracking
            $table->unsignedTinyInteger('status')->default(0)->index();
            $table->unsignedTinyInteger('discovered_via')->nullable();

            $table->timestamps();

            // Composite unique constraint for exact match deduplication
            $table->unique(['name_normalized', 'phone_normalized'], 'unique_name_phone');
            $table->unique('website_normalized', 'unique_website');
        });

        // Add PostGIS geography column for location (lat/lon)
        DB::statement('ALTER TABLE leads ADD COLUMN location geography(POINT, 4326)');

        // Create GIN index for trigram fuzzy search on name
        DB::statement('CREATE INDEX leads_name_trgm_idx ON leads USING gin(name_normalized gin_trgm_ops)');

        // Create GIN index for trigram fuzzy search on address
        DB::statement('CREATE INDEX leads_address_trgm_idx ON leads USING gin(address gin_trgm_ops)');

        // Create GIST index for location proximity queries
        DB::statement('CREATE INDEX leads_location_gist_idx ON leads USING gist(location)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};

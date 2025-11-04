<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
            $table->string('name');
            $table->smallInteger('category');
            $table->string('location');
            $table->string('email');
            $table->string('website_url')->nullable();
            $table->string('google_maps_url')->nullable();
            $table->float('google_rating')->nullable();
            $table->unsignedInteger('google_reviews_count')->nullable();
            $table->string('instagram_handle')->nullable();
            $table->unsignedInteger('instagram_followers')->nullable();
            $table->string('facebook_url')->nullable();
            $table->unsignedTinyInteger('discovered_via')->nullable();
            $table->unsignedTinyInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};

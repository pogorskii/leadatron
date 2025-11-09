<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companyName = fake()->company();

        return [
            'name' => $companyName,
            'category' => fake()->randomElement(\App\Enums\LeadCategoryEnum::cases()),
            'location' => fake()->city().', '.fake()->stateAbbr(),
            'email' => fake()->companyEmail(),
            'website_url' => fake()->optional(0.7)->url(),
            'google_maps_url' => fake()->optional(0.6)->url(),
            'google_rating' => fake()->optional(0.6)->randomFloat(1, 3.0, 5.0),
            'google_reviews_count' => fake()->optional(0.6)->numberBetween(5, 500),
            'instagram_handle' => fake()->optional(0.5)->userName(),
            'instagram_followers' => fake()->optional(0.5)->numberBetween(100, 50000),
            'facebook_url' => fake()->optional(0.5)->url(),
            'discovered_via' => fake()->optional(0.8)->randomElement(\App\Enums\DiscoveredViaEnum::cases()),
            'status' => fake()->randomElement(\App\Enums\LeadStatusEnum::cases()),
        ];
    }
}

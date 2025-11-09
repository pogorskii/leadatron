<?php

namespace App\Models;

use App\Enums\DiscoveredViaEnum;
use App\Enums\LeadCategoryEnum;
use App\Enums\LeadStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    /** @use HasFactory<\Database\Factories\LeadFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'category',
        'location',
        'email',
        'website_url',
        'google_maps_url',
        'google_rating',
        'google_reviews_count',
        'instagram_handle',
        'instagram_followers',
        'facebook_url',
        'discovered_via',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category'             => LeadCategoryEnum::class,
            'discovered_via'       => DiscoveredViaEnum::class,
            'status'               => LeadStatusEnum::class,
            'google_rating'        => 'float',
            'google_reviews_count' => 'integer',
            'instagram_followers'  => 'integer',
        ];
    }
}

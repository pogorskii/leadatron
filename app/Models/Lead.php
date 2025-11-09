<?php

namespace App\Models;

use App\Enums\DiscoveredViaEnum;
use App\Enums\LeadStatusEnum;
use App\Helpers\LeadNormalizer;
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
        'name_normalized',
        'phone_normalized',
        'website_normalized',
        'address',
        'city',
        'postal_code',
        'phone',
        'email',
        'website_url',
        'instagram_handle',
        'instagram_followers',
        'facebook_url',
        'google_maps_url',
        'google_rating',
        'google_reviews_count',
        'business_category',
        'industry_classification',
        'scope',
        'sources',
        'discovered_via',
        'status',
        'location',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discovered_via' => DiscoveredViaEnum::class,
            'status' => LeadStatusEnum::class,
            'google_rating' => 'float',
            'google_reviews_count' => 'integer',
            'instagram_followers' => 'integer',
            'sources' => 'array',
        ];
    }

    /**
     * Boot the model and set up event listeners.
     */
    protected static function booted(): void
    {
        // Automatically normalize fields before saving
        static::saving(function (Lead $lead) {
            if ($lead->isDirty('name')) {
                $lead->name_normalized = LeadNormalizer::normalizeName($lead->name);
            }

            if ($lead->isDirty('phone')) {
                $lead->phone_normalized = LeadNormalizer::normalizePhone($lead->phone);
            }

            if ($lead->isDirty('website_url')) {
                $lead->website_normalized = LeadNormalizer::normalizeWebsite($lead->website_url);
            }
        });
    }

    /**
     * Scope for leads without websites.
     */
    public function scopeWithoutWebsite($query)
    {
        return $query->whereNull('website_url');
    }

    /**
     * Scope for leads by scope (Small, Medium, Corporate).
     */
    public function scopeByScope($query, string $scope)
    {
        return $query->where('scope', $scope);
    }

    /**
     * Scope for leads by industry.
     */
    public function scopeByIndustry($query, string $industry)
    {
        return $query->where('industry_classification', $industry);
    }

    /**
     * Get latitude from PostGIS location.
     */
    public function getLatitudeAttribute(): ?float
    {
        if (! $this->location) {
            return null;
        }

        // Parse "POINT(lon lat)" format
        if (preg_match('/POINT\(([^ ]+) ([^ ]+)\)/', $this->location, $matches)) {
            return (float) $matches[2];
        }

        return null;
    }

    /**
     * Get longitude from PostGIS location.
     */
    public function getLongitudeAttribute(): ?float
    {
        if (! $this->location) {
            return null;
        }

        // Parse "POINT(lon lat)" format
        if (preg_match('/POINT\(([^ ]+) ([^ ]+)\)/', $this->location, $matches)) {
            return (float) $matches[1];
        }

        return null;
    }
}

<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LeadScraperService
{
    private const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

    private const INDUSTRY_MAPPING = [
        'restaurant' => 'Hospitality - F&B',
        'cafe' => 'Hospitality - F&B',
        'bar' => 'Hospitality - F&B',
        'pub' => 'Hospitality - F&B',
        'fast_food' => 'Hospitality - F&B',
        'food_court' => 'Hospitality - F&B',
        'biergarten' => 'Hospitality - F&B',
        'hotel' => 'Hospitality - Lodging',
        'hostel' => 'Hospitality - Lodging',
        'guest_house' => 'Hospitality - Lodging',
        'motel' => 'Hospitality - Lodging',
        'hairdresser' => 'Personal Services - Beauty',
        'beauty' => 'Personal Services - Beauty',
        'nail_salon' => 'Personal Services - Beauty',
        'spa' => 'Health & Wellness',
        'dentist' => 'Health & Wellness - Medical',
        'doctors' => 'Health & Wellness - Medical',
        'clinic' => 'Health & Wellness - Medical',
        'hospital' => 'Health & Wellness - Medical',
        'pharmacy' => 'Health & Wellness - Medical',
        'gym' => 'Health & Wellness - Fitness',
        'fitness_centre' => 'Health & Wellness - Fitness',
        'yoga' => 'Health & Wellness - Fitness',
        'bakery' => 'Retail - Food',
        'butcher' => 'Retail - Food',
        'supermarket' => 'Retail - Food',
        'convenience' => 'Retail - Food',
        'clothes' => 'Retail - Fashion',
        'shoes' => 'Retail - Fashion',
        'jewelry' => 'Retail - Fashion',
        'boutique' => 'Retail - Fashion',
        'lawyer' => 'Professional Services - Legal',
        'accountant' => 'Professional Services - Financial',
        'real_estate' => 'Professional Services - Real Estate',
        'tattoo' => 'Personal Services - Body Art',
        'gallery' => 'Creative - Arts',
        'arts_centre' => 'Creative - Arts',
        'studio' => 'Creative - Arts',
        'coworking_space' => 'Professional Services - Workspace',
    ];

    private const BRAND_CHAINS = [
        'mcdonalds', 'burger king', 'subway', 'starbucks', 'kfc',
        'edeka', 'rewe', 'aldi', 'lidl', 'dm', 'rossmann',
        'h&m', 'zara', 'c&a', 'primark',
    ];

    public function scrapeLeads(string $city = 'Berlin', int $limit = 100): array
    {
        $query = $this->buildOverpassQuery($city, $limit);

        try {
            $response = Http::timeout(60)
                ->withBody($query, 'text/plain')
                ->post(self::OVERPASS_API);

            if (! $response->successful()) {
                throw new \Exception("Overpass API returned status {$response->status()}");
            }

            $data = $response->json();

            return $this->parseResults($data['elements'] ?? []);
        } catch (\Exception $e) {
            Log::error('Lead scraping failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    private function buildOverpassQuery(string $city, int $limit): string
    {
        return <<<QUERY
[out:json][timeout:60];
area[name="{$city}"]["boundary"="administrative"]->.searchArea;
(
  node["amenity"~"restaurant|cafe|bar|pub|fast_food|hotel|hostel|dentist|doctors|clinic|gym|spa"](area.searchArea);
  way["amenity"~"restaurant|cafe|bar|pub|fast_food|hotel|hostel|dentist|doctors|clinic|gym|spa"](area.searchArea);
  node["shop"~"hairdresser|beauty|bakery|clothes|shoes|supermarket|convenience"](area.searchArea);
  way["shop"~"hairdresser|beauty|bakery|clothes|shoes|supermarket|convenience"](area.searchArea);
  node["office"~"lawyer|accountant|real_estate"](area.searchArea);
  way["office"~"lawyer|accountant|real_estate"](area.searchArea);
);
out center {$limit};
QUERY;
    }

    private function parseResults(array $elements): array
    {
        $leads = [];

        foreach ($elements as $element) {
            $tags = $element['tags'] ?? [];

            // Skip if no name
            if (empty($tags['name'])) {
                continue;
            }

            $lead = [
                'name' => $tags['name'],
                'address' => $this->buildAddress($tags),
                'website' => $tags['website'] ?? $tags['contact:website'] ?? null,
                'phone' => $tags['phone'] ?? $tags['contact:phone'] ?? null,
                'business_category' => $this->extractBusinessCategory($tags),
                'industry_classification' => $this->classifyIndustry($tags),
                'facebook' => $tags['contact:facebook'] ?? null,
                'instagram' => $tags['contact:instagram'] ?? null,
                'scope' => $this->inferScope($tags),
                'latitude' => $element['lat'] ?? $element['center']['lat'] ?? null,
                'longitude' => $element['lon'] ?? $element['center']['lon'] ?? null,
                'osm_type' => $element['type'] ?? null,
                'osm_id' => $element['id'] ?? null,
            ];

            $leads[] = $lead;
        }

        return $leads;
    }

    private function buildAddress(array $tags): ?string
    {
        $parts = array_filter([
            $tags['addr:street'] ?? null,
            $tags['addr:housenumber'] ?? null,
            $tags['addr:postcode'] ?? null,
            $tags['addr:city'] ?? null,
        ]);

        return ! empty($parts) ? implode(', ', $parts) : null;
    }

    private function extractBusinessCategory(array $tags): ?string
    {
        // Priority: amenity > shop > office > tourism
        foreach (['amenity', 'shop', 'office', 'tourism', 'craft'] as $key) {
            if (! empty($tags[$key])) {
                return $tags[$key];
            }
        }

        return null;
    }

    private function classifyIndustry(array $tags): string
    {
        $category = $this->extractBusinessCategory($tags);

        if ($category && isset(self::INDUSTRY_MAPPING[$category])) {
            return self::INDUSTRY_MAPPING[$category];
        }

        // Fallback based on primary tag
        if (! empty($tags['amenity'])) {
            return 'Services';
        }
        if (! empty($tags['shop'])) {
            return 'Retail';
        }
        if (! empty($tags['office'])) {
            return 'Professional Services';
        }

        return 'Other';
    }

    private function inferScope(array $tags): string
    {
        $hasWebsite = ! empty($tags['website']) || ! empty($tags['contact:website']);
        $hasBrand = ! empty($tags['brand']) || ! empty($tags['brand:wikidata']);
        $hasOpeningHours = ! empty($tags['opening_hours']);

        // Check if it's a known chain
        $name = strtolower($tags['name'] ?? '');
        $isChain = false;
        foreach (self::BRAND_CHAINS as $chain) {
            if (str_contains($name, $chain)) {
                $isChain = true;
                break;
            }
        }

        if ($hasBrand || $isChain) {
            return 'Corporate';
        }

        if ($hasWebsite && $hasOpeningHours) {
            return 'Medium';
        }

        return 'Small';
    }
}

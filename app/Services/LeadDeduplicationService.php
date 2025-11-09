<?php

namespace App\Services;

use App\Helpers\LeadNormalizer;
use App\Models\Lead;

class LeadDeduplicationService
{
    /**
     * Find potential duplicate leads using multiple strategies.
     */
    public function findDuplicate(array $leadData): ?Lead
    {
        // Strategy 1: Exact match on normalized website
        if (! empty($leadData['website'])) {
            $websiteNorm = LeadNormalizer::normalizeWebsite($leadData['website']);
            if ($websiteNorm) {
                $exact = Lead::where('website_normalized', $websiteNorm)->first();
                if ($exact) {
                    return $exact;
                }
            }
        }

        // Strategy 2: Exact match on normalized phone + city
        if (! empty($leadData['phone']) && ! empty($leadData['city'])) {
            $phoneNorm = LeadNormalizer::normalizePhone($leadData['phone']);
            if ($phoneNorm) {
                $exact = Lead::where('phone_normalized', $phoneNorm)
                    ->where('city', $leadData['city'])
                    ->first();
                if ($exact) {
                    return $exact;
                }
            }
        }

        // Strategy 3: Fuzzy match using composite score
        if (! empty($leadData['latitude']) && ! empty($leadData['longitude'])) {
            return $this->fuzzySearch($leadData);
        }

        return null;
    }

    /**
     * Perform fuzzy search using PostgreSQL trigram similarity and geographic proximity.
     */
    private function fuzzySearch(array $leadData): ?Lead
    {
        $nameNorm = LeadNormalizer::normalizeName($leadData['name']);
        $lat = $leadData['latitude'];
        $lon = $leadData['longitude'];

        // Find candidates using trigram similarity or proximity
        $candidates = Lead::query()
            ->selectRaw('
                *,
                similarity(name_normalized, ?) as name_score,
                ST_Distance(
                    location,
                    ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography
                ) as distance_meters
            ', [$nameNorm, $lon, $lat])
            ->whereRaw('name_normalized % ?', [$nameNorm]) // Trigram threshold
            ->orWhereRaw(
                'ST_DWithin(
                    location::geography,
                    ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography,
                    50
                )',
                [$lon, $lat]
            ) // Within 50 meters
            ->get();

        // Calculate match scores for each candidate
        foreach ($candidates as $candidate) {
            $score = $this->calculateMatchScore($leadData, $candidate);

            if ($score > 0.85) { // 85% confidence threshold
                return $candidate;
            }
        }

        return null;
    }

    /**
     * Calculate weighted match score between new lead and existing lead.
     */
    private function calculateMatchScore(array $newLead, Lead $existing): float
    {
        $weights = [
            'name' => 0.4,
            'location' => 0.3,
            'phone' => 0.2,
            'address' => 0.1,
        ];

        $scores = [];

        // Name similarity (0-1) using PostgreSQL similarity score
        $scores['name'] = $existing->name_score ?? 0;

        // Location proximity (0-1, exponential decay)
        if ($existing->distance_meters !== null) {
            // Score decays exponentially: 1.0 at 0m, 0.5 at 50m, ~0 at 200m
            $scores['location'] = exp(-$existing->distance_meters / 50);
        }

        // Phone exact match (0 or 1)
        if (! empty($newLead['phone']) && $existing->phone_normalized) {
            $newPhoneNorm = LeadNormalizer::normalizePhone($newLead['phone']);
            $scores['phone'] = $newPhoneNorm === $existing->phone_normalized ? 1 : 0;
        }

        // Address similarity (simple string comparison)
        if (! empty($newLead['address']) && $existing->address) {
            $addressSimilarity = 0;
            similar_text(
                strtolower($newLead['address']),
                strtolower($existing->address),
                $addressSimilarity
            );
            $scores['address'] = $addressSimilarity / 100;
        }

        // Calculate weighted sum
        $totalScore = 0;
        $totalWeight = 0;

        foreach ($scores as $key => $score) {
            $totalScore += $score * $weights[$key];
            $totalWeight += $weights[$key];
        }

        return $totalWeight > 0 ? $totalScore / $totalWeight : 0;
    }
}

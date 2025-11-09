<?php

namespace App\Services;

use App\Models\Lead;

class LeadMergeService
{
    /**
     * Merge new lead data into existing lead, enriching with non-null values.
     */
    public function mergeOrUpdate(array $newData, Lead $existing): Lead
    {
        // Track all sources
        $sources = $existing->sources ?? [];
        $sources[] = $newData['source'] ?? 'unknown';
        $existing->sources = array_unique($sources);

        // Merge strategy: prefer non-null, longer, or newer values
        $existing->name = $this->preferBest($existing->name, $newData['name'] ?? null);
        $existing->website_url = $existing->website_url ?? $newData['website'] ?? null;
        $existing->phone = $existing->phone ?? $newData['phone'] ?? null;
        $existing->email = $existing->email ?? $newData['email'] ?? null;
        $existing->facebook_url = $existing->facebook_url ?? $newData['facebook'] ?? null;
        $existing->instagram_handle = $existing->instagram_handle ?? $newData['instagram'] ?? null;

        // Update address if more complete
        if (strlen($newData['address'] ?? '') > strlen($existing->address ?? '')) {
            $existing->address = $newData['address'];
        }

        // Update city if missing
        $existing->city = $existing->city ?? $newData['city'] ?? null;
        $existing->postal_code = $existing->postal_code ?? $newData['postal_code'] ?? null;

        // Update location if available and not set
        if (! $existing->location && ! empty($newData['latitude']) && ! empty($newData['longitude'])) {
            $existing->location = sprintf('POINT(%s %s)', $newData['longitude'], $newData['latitude']);
        }

        // Keep highest quality scope
        if ($this->scopeQuality($newData['scope'] ?? 'Small') > $this->scopeQuality($existing->scope)) {
            $existing->scope = $newData['scope'];
        }

        // Keep most specific industry classification
        if (! empty($newData['industry_classification'])) {
            $existing->industry_classification = $existing->industry_classification ?? $newData['industry_classification'];
        }

        $existing->business_category = $existing->business_category ?? $newData['business_category'] ?? null;

        $existing->updated_at = now();
        $existing->save();

        return $existing;
    }

    /**
     * Prefer the best value between two strings (non-null, longer).
     */
    private function preferBest(?string $a, ?string $b): ?string
    {
        if (! $a) {
            return $b;
        }
        if (! $b) {
            return $a;
        }

        return strlen($a) >= strlen($b) ? $a : $b;
    }

    /**
     * Get numeric quality score for scope (higher = better quality/confidence).
     */
    private function scopeQuality(string $scope): int
    {
        return match ($scope) {
            'Corporate' => 3,
            'Medium' => 2,
            'Small' => 1,
            default => 0,
        };
    }
}

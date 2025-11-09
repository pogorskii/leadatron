<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class LeadNormalizer
{
    /**
     * Normalize business name for deduplication.
     * Removes special characters, converts to lowercase, removes accents.
     */
    public static function normalizeName(string $name): string
    {
        // Convert to ASCII (removes accents: café -> cafe)
        $normalized = Str::ascii($name);

        // Lowercase
        $normalized = Str::lower($normalized);

        // Remove all non-alphanumeric characters
        $normalized = preg_replace('/[^a-z0-9]/', '', $normalized);

        return $normalized;
    }

    /**
     * Normalize phone number to digits only.
     */
    public static function normalizePhone(?string $phone): ?string
    {
        if (! $phone) {
            return null;
        }

        // Remove all non-digit characters
        $normalized = preg_replace('/\D/', '', $phone);

        return $normalized ?: null;
    }

    /**
     * Normalize website URL to domain only (without www).
     */
    public static function normalizeWebsite(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        // Add scheme if missing
        if (! str_starts_with($url, 'http')) {
            $url = 'https://'.$url;
        }

        $parsed = parse_url(strtolower($url));
        $host = $parsed['host'] ?? null;

        if (! $host) {
            return null;
        }

        // Remove www. prefix
        $host = str_replace('www.', '', $host);

        return $host;
    }

    /**
     * Normalize a full lead array for storage.
     */
    public static function normalizeForStorage(array $lead): array
    {
        $lead['name_normalized'] = self::normalizeName($lead['name']);
        $lead['phone_normalized'] = self::normalizePhone($lead['phone'] ?? null);
        $lead['website_normalized'] = self::normalizeWebsite($lead['website'] ?? $lead['website_url'] ?? null);

        return $lead;
    }
}

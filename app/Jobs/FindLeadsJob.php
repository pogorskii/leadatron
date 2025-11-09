<?php

namespace App\Jobs;

use App\Helpers\LeadNormalizer;
use App\Models\Lead;
use App\Services\LeadDeduplicationService;
use App\Services\LeadMergeService;
use App\Services\LeadScraperService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class FindLeadsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $jobId,
        public string $city = 'Berlin',
        public int $limit = 100
    ) {}

    public function handle(
        LeadScraperService $scraper,
        LeadDeduplicationService $dedup,
        LeadMergeService $merger
    ): void {
        $cacheKey = "leads_job:{$this->jobId}";

        try {
            // Update status to processing
            Cache::put($cacheKey, [
                'status' => 'processing',
                'progress' => 0,
                'results' => [],
                'error' => null,
            ], now()->addHour());

            // Scrape leads
            $rawLeads = $scraper->scrapeLeads($this->city, $this->limit);

            $stats = ['new' => 0, 'merged' => 0, 'skipped' => 0];

            // Process each lead with deduplication
            foreach ($rawLeads as $rawLead) {
                // Add source tracking
                $rawLead['source'] = "osm:{$rawLead['osm_id']}";

                // Normalize city
                $rawLead['city'] = $this->city;

                // Check for duplicates
                $duplicate = $dedup->findDuplicate($rawLead);

                if ($duplicate) {
                    // Merge with existing lead
                    $merger->mergeOrUpdate($rawLead, $duplicate);
                    $stats['merged']++;
                } else {
                    // Create new lead
                    $normalized = LeadNormalizer::normalizeForStorage($rawLead);

                    // Set location from lat/lon
                    if (! empty($normalized['latitude']) && ! empty($normalized['longitude'])) {
                        $normalized['location'] = sprintf(
                            'POINT(%s %s)',
                            $normalized['longitude'],
                            $normalized['latitude']
                        );
                    }

                    Lead::create([
                        'name' => $normalized['name'],
                        'name_normalized' => $normalized['name_normalized'],
                        'address' => $normalized['address'] ?? null,
                        'city' => $normalized['city'],
                        'phone' => $normalized['phone'] ?? null,
                        'phone_normalized' => $normalized['phone_normalized'],
                        'website_url' => $normalized['website'] ?? null,
                        'website_normalized' => $normalized['website_normalized'],
                        'business_category' => $normalized['business_category'] ?? null,
                        'industry_classification' => $normalized['industry_classification'],
                        'scope' => $normalized['scope'],
                        'facebook_url' => $normalized['facebook'] ?? null,
                        'instagram_handle' => $normalized['instagram'] ?? null,
                        'sources' => [$normalized['source']],
                        'location' => $normalized['location'] ?? null,
                    ]);

                    $stats['new']++;
                }
            }

            // Update cache with results
            Cache::put($cacheKey, [
                'status' => 'completed',
                'progress' => 100,
                'results' => $rawLeads,
                'error' => null,
                'total' => count($rawLeads),
                'stats' => $stats,
            ], now()->addHour());
        } catch (\Exception $e) {
            // Update with error
            Cache::put($cacheKey, [
                'status' => 'failed',
                'progress' => 0,
                'results' => [],
                'error' => $e->getMessage(),
            ], now()->addHour());

            throw $e;
        }
    }
}

<?php

namespace App\Jobs;

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

    public function handle(LeadScraperService $scraper): void
    {
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
            $leads = $scraper->scrapeLeads($this->city, $this->limit);

            // Update with results
            Cache::put($cacheKey, [
                'status' => 'completed',
                'progress' => 100,
                'results' => $leads,
                'error' => null,
                'total' => count($leads),
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

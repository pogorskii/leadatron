<?php

namespace App\Http\Controllers;

use App\Jobs\FindLeadsJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FindLeadsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('leads/find-leads');
    }

    public function trigger(Request $request)
    {
        $validated = $request->validate([
            'city' => 'string|nullable',
            'limit' => 'integer|min:1|max:500|nullable',
        ]);

        $jobId = Str::uuid()->toString();
        $city = $validated['city'] ?? 'Berlin';
        $limit = $validated['limit'] ?? 100;

        // Initialize cache entry
        Cache::put("leads_job:{$jobId}", [
            'status' => 'pending',
            'progress' => 0,
            'results' => [],
            'error' => null,
        ], now()->addHour());

        // Dispatch job
        FindLeadsJob::dispatch($jobId, $city, $limit);

        return response()->json([
            'job_id' => $jobId,
            'message' => 'Lead scraping started',
        ]);
    }

    public function status(string $jobId)
    {
        $cacheKey = "leads_job:{$jobId}";
        $data = Cache::get($cacheKey);

        if (! $data) {
            return response()->json([
                'status' => 'not_found',
                'error' => 'Job not found',
            ], 404);
        }

        return response()->json($data);
    }
}

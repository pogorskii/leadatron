<?php

namespace App\Http\Controllers;

use App\Enums\LeadCategoryEnum;
use App\Enums\LeadStatusEnum;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Http\Resources\LeadResource;
use App\Models\Lead;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $query = Lead::query();

        // Search
        if (request('search')) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('location', 'ilike', "%{$search}%")
                    ->orWhere('instagram_handle', 'ilike', "%{$search}%");
            });
        }

        // Filter by status
        if (request('status') !== null && request('status') !== '') {
            $query->where('status', request('status'));
        }

        // Filter by category
        if (request('category') !== null && request('category') !== '') {
            $query->where('category', request('category'));
        }

        // Sorting
        $sortBy = request('sort_by', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $allowedSortFields = ['name', 'category', 'location', 'email', 'status', 'created_at', 'updated_at', 'google_rating', 'google_reviews_count'];

        if (in_array($sortBy, $allowedSortFields, true)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Pagination
        $perPage = (int) request('per_page', 10);
        $perPage = min(max($perPage, 5), 100); // Between 5 and 100

        $leads = $query->paginate($perPage)->withQueryString();

        return Inertia::render('leads/leads-index', [
            'leads' => LeadResource::collection($leads->items())->resolve(),
            'pagination' => [
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
                'per_page' => $leads->perPage(),
                'total' => $leads->total(),
                'from' => $leads->firstItem(),
                'to' => $leads->lastItem(),
            ],
            'filters' => [
                'search' => request('search'),
                'status' => request('status'),
                'category' => request('category'),
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
            'statusOptions' => collect(LeadStatusEnum::cases())->map(fn ($status) => [
                'value' => $status->value,
                'label' => $status->name,
            ])->values(),
            'categoryOptions' => collect(LeadCategoryEnum::cases())->map(fn ($category) => [
                'value' => $category->value,
                'label' => $category->name,
            ])->values(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lead $lead)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        //
    }
}

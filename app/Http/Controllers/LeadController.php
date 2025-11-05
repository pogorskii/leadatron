<?php

namespace App\Http\Controllers;

use App\Enums\DiscoveredVia;
use App\Enums\LeadCategory;
use App\Enums\LeadStatus;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->integer('per_page', 10);
        $search = $request->string('search')->value();
        $sortBy = $request->string('sort_by', 'created_at')->value();
        $sortDirection = $request->string('sort_direction', 'desc')->value();

        $query = Lead::query();

        // Search across multiple fields
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('email', 'ILIKE', "%{$search}%")
                    ->orWhere('location', 'ILIKE', "%{$search}%")
                    ->orWhere('instagram_handle', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->filled('category')) {
            $query->where('category', $request->integer('category'));
        }

        // Filter by status
        if ($request->has('status') && $request->filled('status')) {
            $query->where('status', $request->integer('status'));
        }

        // Filter by discovered_via
        if ($request->has('discovered_via') && $request->filled('discovered_via')) {
            $query->where('discovered_via', $request->integer('discovered_via'));
        }

        // Sorting
        $allowedSortColumns = ['name', 'email', 'location', 'category', 'status', 'created_at', 'google_rating', 'google_reviews_count'];
        if (in_array($sortBy, $allowedSortColumns, true)) {
            $query->orderBy($sortBy, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        $leads = $query->paginate($perPage)->withQueryString();

        return Inertia::render('leads/index', [
            'leads' => $leads,
            'filters' => [
                'search' => $search,
                'category' => $request->integer('category'),
                'status' => $request->integer('status'),
                'discovered_via' => $request->integer('discovered_via'),
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
            'categories' => collect(LeadCategory::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
            'statuses' => collect(LeadStatus::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
            'discoveredViaOptions' => collect(DiscoveredVia::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('leads/create', [
            'categories' => collect(LeadCategory::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
            'statuses' => collect(LeadStatus::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
            'discoveredViaOptions' => collect(DiscoveredVia::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request)
    {
        $lead = Lead::create($request->validated());

        return redirect()
            ->route('leads.show', $lead)
            ->with('success', 'Lead created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead): Response
    {
        return Inertia::render('leads/show', [
            'lead' => $lead,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lead $lead): Response
    {
        return Inertia::render('leads/edit', [
            'lead' => $lead,
            'categories' => collect(LeadCategory::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
            'statuses' => collect(LeadStatus::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
            'discoveredViaOptions' => collect(DiscoveredVia::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => $case->name,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        $lead->update($request->validated());

        return redirect()
            ->route('leads.show', $lead)
            ->with('success', 'Lead updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead deleted successfully.');
    }
}

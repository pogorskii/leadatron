<?php

namespace App\Http\Requests;

use App\Enums\DiscoveredViaEnum;
use App\Enums\LeadCategoryEnum;
use App\Enums\LeadStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(LeadCategoryEnum::class)],
            'location' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'google_maps_url' => ['nullable', 'url', 'max:255'],
            'google_rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'google_reviews_count' => ['nullable', 'integer', 'min:0'],
            'instagram_handle' => ['nullable', 'string', 'max:255'],
            'instagram_followers' => ['nullable', 'integer', 'min:0'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'discovered_via' => ['nullable', Rule::enum(DiscoveredViaEnum::class)],
            'status' => ['nullable', Rule::enum(LeadStatusEnum::class)],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Lead name is required.',
            'category.required' => 'Lead category is required.',
            'location.required' => 'Location is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'google_rating.min' => 'Google rating must be at least 0.',
            'google_rating.max' => 'Google rating cannot exceed 5.',
            'google_reviews_count.min' => 'Google reviews count cannot be negative.',
            'instagram_followers.min' => 'Instagram followers count cannot be negative.',
        ];
    }
}

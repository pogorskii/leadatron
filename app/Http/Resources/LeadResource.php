<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => [
                'value' => $this->category,
                'name' => $this->category->name,
            ],
            'location' => $this->location,
            'email' => $this->email,
            'website_url' => $this->website_url,
            'google_maps_url' => $this->google_maps_url,
            'google_rating' => $this->google_rating,
            'google_reviews_count' => $this->google_reviews_count,
            'instagram_handle' => $this->instagram_handle,
            'instagram_followers' => $this->instagram_followers,
            'facebook_url' => $this->facebook_url,
            'discovered_via' => $this->when($this->discovered_via, [
                'value' => $this->discovered_via,
                'name' => $this->discovered_via?->name,
            ]),
            'status' => [
                'value' => $this->status,
                'name' => $this->status->name,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

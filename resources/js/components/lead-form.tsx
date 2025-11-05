import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type Lead, type SelectOption } from '@/types';
import { Form } from '@inertiajs/react';

interface LeadFormProps {
    lead?: Lead;
    categories: SelectOption[];
    statuses: SelectOption[];
    discoveredViaOptions: SelectOption[];
    action: string;
    method?: 'post' | 'put' | 'patch';
}

export default function LeadForm({
    lead,
    categories,
    statuses,
    discoveredViaOptions,
    action,
    method = 'post',
}: LeadFormProps) {
    return (
        <Form action={action} method={method} className="space-y-6">
            {({ errors, processing, data, setData }) => (
                <>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={lead?.name || ''}
                                required
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={lead?.email || ''}
                                required
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                name="category"
                                defaultValue={lead?.category.toString() || ''}
                                required
                            >
                                <SelectTrigger aria-invalid={!!errors.category}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value.toString()}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">
                                Location <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                type="text"
                                defaultValue={lead?.location || ''}
                                required
                                aria-invalid={!!errors.location}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                name="status"
                                defaultValue={lead?.status.toString() || '0'}
                            >
                                <SelectTrigger aria-invalid={!!errors.status}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value.toString()}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-500">{errors.status}</p>
                            )}
                        </div>

                        {/* Discovered Via */}
                        <div className="space-y-2">
                            <Label htmlFor="discovered_via">Discovered Via</Label>
                            <Select
                                name="discovered_via"
                                defaultValue={lead?.discovered_via?.toString() || ''}
                            >
                                <SelectTrigger aria-invalid={!!errors.discovered_via}>
                                    <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Not specified</SelectItem>
                                    {discoveredViaOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value.toString()}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.discovered_via && (
                                <p className="text-sm text-red-500">{errors.discovered_via}</p>
                            )}
                        </div>

                        {/* Website URL */}
                        <div className="space-y-2">
                            <Label htmlFor="website_url">Website URL</Label>
                            <Input
                                id="website_url"
                                name="website_url"
                                type="url"
                                defaultValue={lead?.website_url || ''}
                                placeholder="https://example.com"
                                aria-invalid={!!errors.website_url}
                            />
                            {errors.website_url && (
                                <p className="text-sm text-red-500">{errors.website_url}</p>
                            )}
                        </div>

                        {/* Google Maps URL */}
                        <div className="space-y-2">
                            <Label htmlFor="google_maps_url">Google Maps URL</Label>
                            <Input
                                id="google_maps_url"
                                name="google_maps_url"
                                type="url"
                                defaultValue={lead?.google_maps_url || ''}
                                placeholder="https://maps.google.com/..."
                                aria-invalid={!!errors.google_maps_url}
                            />
                            {errors.google_maps_url && (
                                <p className="text-sm text-red-500">{errors.google_maps_url}</p>
                            )}
                        </div>

                        {/* Google Rating */}
                        <div className="space-y-2">
                            <Label htmlFor="google_rating">Google Rating</Label>
                            <Input
                                id="google_rating"
                                name="google_rating"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                defaultValue={lead?.google_rating?.toString() || ''}
                                placeholder="0.0 - 5.0"
                                aria-invalid={!!errors.google_rating}
                            />
                            {errors.google_rating && (
                                <p className="text-sm text-red-500">{errors.google_rating}</p>
                            )}
                        </div>

                        {/* Google Reviews Count */}
                        <div className="space-y-2">
                            <Label htmlFor="google_reviews_count">Google Reviews Count</Label>
                            <Input
                                id="google_reviews_count"
                                name="google_reviews_count"
                                type="number"
                                min="0"
                                defaultValue={lead?.google_reviews_count?.toString() || ''}
                                placeholder="0"
                                aria-invalid={!!errors.google_reviews_count}
                            />
                            {errors.google_reviews_count && (
                                <p className="text-sm text-red-500">
                                    {errors.google_reviews_count}
                                </p>
                            )}
                        </div>

                        {/* Instagram Handle */}
                        <div className="space-y-2">
                            <Label htmlFor="instagram_handle">Instagram Handle</Label>
                            <Input
                                id="instagram_handle"
                                name="instagram_handle"
                                type="text"
                                defaultValue={lead?.instagram_handle || ''}
                                placeholder="@username"
                                aria-invalid={!!errors.instagram_handle}
                            />
                            {errors.instagram_handle && (
                                <p className="text-sm text-red-500">{errors.instagram_handle}</p>
                            )}
                        </div>

                        {/* Instagram Followers */}
                        <div className="space-y-2">
                            <Label htmlFor="instagram_followers">Instagram Followers</Label>
                            <Input
                                id="instagram_followers"
                                name="instagram_followers"
                                type="number"
                                min="0"
                                defaultValue={lead?.instagram_followers?.toString() || ''}
                                placeholder="0"
                                aria-invalid={!!errors.instagram_followers}
                            />
                            {errors.instagram_followers && (
                                <p className="text-sm text-red-500">{errors.instagram_followers}</p>
                            )}
                        </div>

                        {/* Facebook URL */}
                        <div className="space-y-2">
                            <Label htmlFor="facebook_url">Facebook URL</Label>
                            <Input
                                id="facebook_url"
                                name="facebook_url"
                                type="url"
                                defaultValue={lead?.facebook_url || ''}
                                placeholder="https://facebook.com/..."
                                aria-invalid={!!errors.facebook_url}
                            />
                            {errors.facebook_url && (
                                <p className="text-sm text-red-500">{errors.facebook_url}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

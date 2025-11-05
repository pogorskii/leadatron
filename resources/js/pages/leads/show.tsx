import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Lead } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Facebook,
    Globe,
    Instagram,
    Mail,
    MapPin,
    Pencil,
    Star,
    Trash2,
} from 'lucide-react';

interface ShowProps {
    lead: Lead;
}

const categoryLabels: Record<number, string> = {
    1: 'Restaurant',
    2: 'Cafe',
    3: 'Retail',
    4: 'Service',
    5: 'Healthcare',
    6: 'Fitness',
    7: 'Beauty',
    8: 'Entertainment',
    9: 'Professional',
    10: 'Other',
};

const statusLabels: Record<number, string> = {
    0: 'New',
    1: 'Contacted',
    2: 'Qualified',
    3: 'Negotiating',
    4: 'Won',
    5: 'Lost',
    6: 'Archived',
};

const discoveredViaLabels: Record<number, string> = {
    1: 'Google Maps',
    2: 'Instagram',
    3: 'Facebook',
    4: 'Website',
    5: 'Referral',
    6: 'Direct Search',
    7: 'Advertisement',
    8: 'Other',
};

const getStatusColor = (status: number) => {
    const colors: Record<number, string> = {
        0: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        2: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        3: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        4: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
        5: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        6: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[status] || '';
};

export default function Show({ lead }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Leads',
            href: '/leads',
        },
        {
            title: lead.name,
            href: `/leads/${lead.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this lead?')) {
            router.delete(`/leads/${lead.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lead.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{lead.name}</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Lead details and information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/leads/${lead.id}/edit`}>
                            <Button variant="outline">
                                <Pencil />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building2 className="mt-0.5 size-5 text-neutral-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Category
                                    </p>
                                    <p className="text-base">{categoryLabels[lead.category]}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-5 text-neutral-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Location
                                    </p>
                                    <p className="text-base">{lead.location}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 size-5 text-neutral-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${lead.email}`}
                                        className="text-base text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        {lead.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 size-5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Status
                                    </p>
                                    <Badge className={getStatusColor(lead.status)}>
                                        {statusLabels[lead.status]}
                                    </Badge>
                                </div>
                            </div>

                            {lead.discovered_via && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 size-5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                            Discovered Via
                                        </p>
                                        <p className="text-base">
                                            {discoveredViaLabels[lead.discovered_via]}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Online Presence */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Online Presence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lead.website_url && (
                                <div className="flex items-start gap-3">
                                    <Globe className="mt-0.5 size-5 text-neutral-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                            Website
                                        </p>
                                        <a
                                            href={lead.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {lead.website_url}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {lead.google_maps_url && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 size-5 text-neutral-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                            Google Maps
                                        </p>
                                        <a
                                            href={lead.google_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            View on Google Maps
                                        </a>
                                    </div>
                                </div>
                            )}

                            {lead.instagram_handle && (
                                <div className="flex items-start gap-3">
                                    <Instagram className="mt-0.5 size-5 text-neutral-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                            Instagram
                                        </p>
                                        <a
                                            href={`https://instagram.com/${lead.instagram_handle.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {lead.instagram_handle}
                                        </a>
                                        {lead.instagram_followers && (
                                            <p className="text-sm text-neutral-500">
                                                {lead.instagram_followers.toLocaleString()} followers
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {lead.facebook_url && (
                                <div className="flex items-start gap-3">
                                    <Facebook className="mt-0.5 size-5 text-neutral-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                            Facebook
                                        </p>
                                        <a
                                            href={lead.facebook_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            View on Facebook
                                        </a>
                                    </div>
                                </div>
                            )}

                            {!lead.website_url &&
                                !lead.google_maps_url &&
                                !lead.instagram_handle &&
                                !lead.facebook_url && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        No online presence information available
                                    </p>
                                )}
                        </CardContent>
                    </Card>

                    {/* Google Reviews */}
                    {(lead.google_rating || lead.google_reviews_count) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Google Reviews</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {lead.google_rating && (
                                    <div className="flex items-start gap-3">
                                        <Star className="mt-0.5 size-5 text-yellow-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                                Rating
                                            </p>
                                            <p className="text-base">
                                                {lead.google_rating.toFixed(1)} / 5.0
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {lead.google_reviews_count && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 size-5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                                Reviews Count
                                            </p>
                                            <p className="text-base">
                                                {lead.google_reviews_count.toLocaleString()} reviews
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timestamps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 size-5 text-neutral-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Created
                                    </p>
                                    <p className="text-base">{formatDate(lead.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 size-5 text-neutral-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        Last Updated
                                    </p>
                                    <p className="text-base">{formatDate(lead.updated_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

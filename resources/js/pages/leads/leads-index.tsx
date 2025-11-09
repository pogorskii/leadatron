import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface Lead {
    id: number;
    name: string;
    category: {
        value: number;
        name: string;
    };
    location: string;
    email: string;
    website_url?: string;
    google_maps_url?: string;
    google_rating?: number;
    google_reviews_count?: number;
    instagram_handle?: string;
    instagram_followers?: number;
    facebook_url?: string;
    discovered_via?: {
        value: number;
        name: string;
    };
    status: {
        value: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Filters {
    search?: string;
    status?: number | string;
    category?: number | string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
    per_page?: number;
}

interface Option {
    value: number;
    label: string;
}

interface LeadsIndexProps {
    leads: Lead[];
    pagination: Pagination;
    filters: Filters;
    statusOptions: Option[];
    categoryOptions: Option[];
}

export default function LeadsIndex({
    leads,
    pagination,
    filters,
    statusOptions,
    categoryOptions,
}: LeadsIndexProps) {
    const updateFilter = (key: string, value: any) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                [key]: value,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        router.get(
            window.location.pathname,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getStatusBadgeVariant = (statusValue: number) => {
        switch (statusValue) {
            case 0: // New
                return 'default';
            case 1: // Contacted
                return 'secondary';
            case 2: // Qualified
                return 'default';
            case 3: // Negotiating
                return 'default';
            case 4: // Won
                return 'default';
            case 5: // Lost
                return 'destructive';
            case 6: // Archived
                return 'secondary';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (row: Lead) => <span className="font-medium">{row.name}</span>,
        },
        {
            key: 'category',
            header: 'Category',
            sortable: true,
            render: (row: Lead) => row.category.name,
        },
        {
            key: 'location',
            header: 'Location',
            sortable: true,
            render: (row: Lead) => row.location,
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true,
            render: (row: Lead) => (
                <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                    {row.email}
                </a>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (row: Lead) => (
                <Badge variant={getStatusBadgeVariant(row.status.value)}>
                    {row.status.name}
                </Badge>
            ),
        },
        {
            key: 'google_rating',
            header: 'Google Rating',
            sortable: true,
            render: (row: Lead) =>
                row.google_rating
                    ? `${row.google_rating.toFixed(1)} ⭐`
                    : '-',
        },
        {
            key: 'created_at',
            header: 'Created',
            sortable: true,
            render: (row: Lead) =>
                format(new Date(row.created_at), 'MMM d, yyyy'),
        },
    ];

    const hasActiveFilters = filters.search || filters.status || filters.category;

    const filterComponents = (
        <>
            <Select
                value={filters.category?.toString() || ''}
                onValueChange={(value) => updateFilter('category', value || '')}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.status?.toString() || ''}
                onValueChange={(value) => updateFilter('status', value || '')}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10"
                >
                    Clear
                    <X className="ml-2 h-4 w-4" />
                </Button>
            )}
        </>
    );

    return (
        <AppLayout>
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Leads</CardTitle>
                        <CardDescription>
                            Manage and track your business leads
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={leads}
                            pagination={pagination}
                            filters={filters}
                            filterComponents={filterComponents}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

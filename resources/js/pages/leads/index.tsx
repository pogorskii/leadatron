import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Lead, type PaginatedData, type SelectOption } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowUpDown, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface IndexProps {
    leads: PaginatedData<Lead>;
    filters: {
        search: string;
        category: number | null;
        status: number | null;
        discovered_via: number | null;
        sort_by: string;
        sort_direction: string;
        per_page: number;
    };
    categories: SelectOption[];
    statuses: SelectOption[];
    discoveredViaOptions: SelectOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: '/leads',
    },
];

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

export default function Index({
    leads,
    filters,
    categories,
    statuses,
    discoveredViaOptions,
}: IndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        updateFilters({ search: searchValue });
    };

    const updateFilters = (newFilters: Record<string, unknown>) => {
        router.get(
            '/leads',
            {
                ...filters,
                ...newFilters,
            },
            { preserveState: true },
        );
    };

    const handleSort = (column: string) => {
        const newDirection =
            filters.sort_by === column && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        updateFilters({ sort_by: column, sort_direction: newDirection });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            router.delete(`/leads/${id}`);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const currentPage = leads.current_page;
        const lastPage = leads.last_page;
        const maxVisible = 5;

        if (lastPage <= maxVisible) {
            for (let i = 1; i <= lastPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={i === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                updateFilters({ page: i });
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        href="#"
                        isActive={1 === currentPage}
                        onClick={(e) => {
                            e.preventDefault();
                            updateFilters({ page: 1 });
                        }}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>,
            );

            if (currentPage > 3) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(lastPage - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={i === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                updateFilters({ page: i });
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                );
            }

            if (currentPage < lastPage - 2) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }

            items.push(
                <PaginationItem key={lastPage}>
                    <PaginationLink
                        href="#"
                        isActive={lastPage === currentPage}
                        onClick={(e) => {
                            e.preventDefault();
                            updateFilters({ page: lastPage });
                        }}
                    >
                        {lastPage}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        return items;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Leads</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Manage your leads and contacts
                        </p>
                    </div>
                    <Link href="/leads/create">
                        <Button>
                            <Plus />
                            Add Lead
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                                <Input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-2">
                            <Select
                                value={filters.category?.toString() || ''}
                                onValueChange={(value) =>
                                    updateFilters({ category: value || null })
                                }
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value.toString()}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.status?.toString() || ''}
                                onValueChange={(value) => updateFilters({ status: value || null })}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Statuses</SelectItem>
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

                            <Select
                                value={filters.discovered_via?.toString() || ''}
                                onValueChange={(value) =>
                                    updateFilters({ discovered_via: value || null })
                                }
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Sources</SelectItem>
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
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
                                            className="h-8 px-2"
                                        >
                                            Name
                                            <ArrowUpDown className="ml-2 size-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('category')}
                                            className="h-8 px-2"
                                        >
                                            Category
                                            <ArrowUpDown className="ml-2 size-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('location')}
                                            className="h-8 px-2"
                                        >
                                            Location
                                            <ArrowUpDown className="ml-2 size-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('email')}
                                            className="h-8 px-2"
                                        >
                                            Email
                                            <ArrowUpDown className="ml-2 size-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('status')}
                                            className="h-8 px-2"
                                        >
                                            Status
                                            <ArrowUpDown className="ml-2 size-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No leads found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leads.data.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="font-medium">
                                                {lead.name}
                                            </TableCell>
                                            <TableCell>
                                                {categories.find((c) => c.value === lead.category)
                                                    ?.label || '-'}
                                            </TableCell>
                                            <TableCell>{lead.location}</TableCell>
                                            <TableCell>{lead.email}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(lead.status)}>
                                                    {statuses.find((s) => s.value === lead.status)
                                                        ?.label || '-'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/leads/${lead.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/leads/${lead.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(lead.id)}
                                                    >
                                                        <Trash2 className="size-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                Rows per page:
                            </span>
                            <Select
                                value={filters.per_page.toString()}
                                onValueChange={(value) => updateFilters({ per_page: value })}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            Showing {leads.from} to {leads.to} of {leads.total} entries
                        </div>

                        <Pagination>
                            <PaginationContent>
                                {leads.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                updateFilters({ page: leads.current_page - 1 });
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                                {renderPaginationItems()}
                                {leads.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                updateFilters({ page: leads.current_page + 1 });
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

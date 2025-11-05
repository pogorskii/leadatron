import LeadForm from '@/components/lead-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SelectOption } from '@/types';
import { Head } from '@inertiajs/react';

interface CreateProps {
    categories: SelectOption[];
    statuses: SelectOption[];
    discoveredViaOptions: SelectOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: '/leads',
    },
    {
        title: 'Create',
        href: '/leads/create',
    },
];

export default function Create({ categories, statuses, discoveredViaOptions }: CreateProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Lead" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Create Lead</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Add a new lead to your database
                    </p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <LeadForm
                        categories={categories}
                        statuses={statuses}
                        discoveredViaOptions={discoveredViaOptions}
                        action="/leads"
                        method="post"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

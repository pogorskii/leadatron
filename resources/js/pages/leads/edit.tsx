import LeadForm from '@/components/lead-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Lead, type SelectOption } from '@/types';
import { Head } from '@inertiajs/react';

interface EditProps {
    lead: Lead;
    categories: SelectOption[];
    statuses: SelectOption[];
    discoveredViaOptions: SelectOption[];
}

export default function Edit({ lead, categories, statuses, discoveredViaOptions }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Leads',
            href: '/leads',
        },
        {
            title: lead.name,
            href: `/leads/${lead.id}`,
        },
        {
            title: 'Edit',
            href: `/leads/${lead.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${lead.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Lead</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Update lead information
                    </p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <LeadForm
                        lead={lead}
                        categories={categories}
                        statuses={statuses}
                        discoveredViaOptions={discoveredViaOptions}
                        action={`/leads/${lead.id}`}
                        method="put"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

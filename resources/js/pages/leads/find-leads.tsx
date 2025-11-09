import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import * as leads from '@/routes/leads';
import {
    status as statusRoute,
    trigger as triggerRoute,
} from '@/routes/leads/find';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: leads.index().url,
    },
    {
        title: 'Find Leads',
        href: '/leads/find',
    },
];

type JobStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'not_found';

interface JobData {
    status: JobStatus;
    progress: number;
    results: Lead[];
    error: string | null;
    total?: number;
}

interface Lead {
    name: string;
    address: string | null;
    website: string | null;
    phone: string | null;
    business_category: string | null;
    industry_classification: string;
    facebook: string | null;
    instagram: string | null;
    scope: 'Small' | 'Medium' | 'Corporate';
    latitude: number | null;
    longitude: number | null;
}

export default function FindLeads() {
    const [isSearching, setIsSearching] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobData, setJobData] = useState<JobData | null>(null);

    const pollStatus = useCallback(async (id: string) => {
        try {
            const response = await axios.get(statusRoute.url({ jobId: id }));
            const data: JobData = response.data;

            setJobData(data);

            if (data.status === 'completed' || data.status === 'failed') {
                setIsSearching(false);
                setJobId(null);
            }
        } catch (error) {
            console.error('Failed to poll status:', error);
            setIsSearching(false);
            setJobId(null);
        }
    }, []);

    useEffect(() => {
        if (!jobId) {
            return;
        }

        const interval = setInterval(() => {
            pollStatus(jobId);
        }, 2000);

        return () => clearInterval(interval);
    }, [jobId, pollStatus]);

    const handleFindLeads = async () => {
        setIsSearching(true);
        setJobData(null);

        try {
            const response = await axios.post(triggerRoute.url(), {
                city: 'Berlin',
                limit: 100,
            });

            setJobId(response.data.job_id);
        } catch (error) {
            console.error('Failed to start job:', error);
            setIsSearching(false);
        }
    };

    const getScopeColor = (scope: string) => {
        switch (scope) {
            case 'Small':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Medium':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Corporate':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Find Leads" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Find Leads</h1>
                        <p className="text-sm text-muted-foreground">
                            Discover potential clients in Berlin using
                            OpenStreetMap data
                        </p>
                    </div>
                    <Button
                        onClick={handleFindLeads}
                        disabled={isSearching}
                        size="lg"
                    >
                        {isSearching ? (
                            <>
                                <Spinner className="mr-2" />
                                Searching...
                            </>
                        ) : (
                            'Find Leads'
                        )}
                    </Button>
                </div>

                {jobData?.status === 'processing' && (
                    <Alert>
                        <Spinner className="mr-2" />
                        <div>
                            <p className="font-medium">
                                Searching for leads...
                            </p>
                            <p className="text-sm text-muted-foreground">
                                This may take a minute. Please wait.
                            </p>
                        </div>
                    </Alert>
                )}

                {jobData?.status === 'failed' && (
                    <Alert variant="destructive">
                        <p className="font-medium">Search failed</p>
                        <p className="text-sm">{jobData.error}</p>
                    </Alert>
                )}

                {jobData?.status === 'completed' &&
                    jobData.results.length > 0 && (
                        <Card className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    Found {jobData.total} Leads
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b">
                                        <tr className="text-left">
                                            <th className="pr-4 pb-3 font-medium">
                                                Name
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Address
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Website
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Category
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Industry
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Scope
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Phone
                                            </th>
                                            <th className="pr-4 pb-3 font-medium">
                                                Social
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {jobData.results.map((lead, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-muted/50"
                                            >
                                                <td className="py-3 pr-4 font-medium">
                                                    {lead.name}
                                                </td>
                                                <td className="py-3 pr-4 text-muted-foreground">
                                                    {lead.address || '-'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {lead.website ? (
                                                        <a
                                                            href={lead.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            Link
                                                        </a>
                                                    ) : (
                                                        <span className="text-red-600 dark:text-red-400">
                                                            No site
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {lead.business_category ||
                                                        '-'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {
                                                        lead.industry_classification
                                                    }
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <Badge
                                                        className={getScopeColor(
                                                            lead.scope,
                                                        )}
                                                    >
                                                        {lead.scope}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {lead.phone || '-'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex gap-2">
                                                        {lead.facebook && (
                                                            <a
                                                                href={
                                                                    lead.facebook
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                FB
                                                            </a>
                                                        )}
                                                        {lead.instagram && (
                                                            <a
                                                                href={
                                                                    lead.instagram
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-pink-600 hover:underline dark:text-pink-400"
                                                            >
                                                                IG
                                                            </a>
                                                        )}
                                                        {!lead.facebook &&
                                                            !lead.instagram &&
                                                            '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                {jobData?.status === 'completed' &&
                    jobData.results.length === 0 && (
                        <Alert>
                            <p className="font-medium">No leads found</p>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your search criteria.
                            </p>
                        </Alert>
                    )}
            </div>
        </AppLayout>
    );
}

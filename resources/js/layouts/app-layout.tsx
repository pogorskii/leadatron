import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

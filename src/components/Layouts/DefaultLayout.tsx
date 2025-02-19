'use client';
import React, { useEffect, useState } from 'react';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import RouteGuard from '../RouteGuard';
import { TableNotionProvider } from '@/context/NotionTableContext';
import { GeneralUIProvider } from '@/context/GeneralUIContext';
import { DefaultLayoutProvider } from '@/context/DefaultLayoutContext';
import NewForm from '../Modals/NewForm';
import Show from '../Show';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../NewSidebar';
import { usePathname, useRouter } from 'next/navigation';
import ThemeSwitcher from '../CrmUi/ThemeSwitcher';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { getTenantFromUrl } from '@/utils/getHostFromUrl';
import useApplyTenantTheme from '@/hooks/useApplyTenantTheme';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const [showAlert, setShowAlert] = useState(true);
    const [styleRelated, setStyleRelated] = useState({ opacity: 1 });

    const path = usePathname();

    useApplyTenantTheme();

    return (
        <>
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <DefaultLayoutProvider>
                <Analytics />
                <SpeedInsights />
                <GeneralUIProvider>
                    <div className="flex h-screen overflow-hidden">
                        <SidebarProvider
                            defaultOpen={document.cookie.includes('sidebar:state=true')}
                        >
                            <AppSidebar />
                            <SidebarInset>
                                <div className="relative flex flex-1 flex-col overflow-hidden">
                                    <header className="position-sticky dark:shadow-dark sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-white shadow-sm transition-[width,height] duration-300 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:bg-boxdark">
                                        <div className="flex items-center gap-2 px-4">
                                            <SidebarTrigger className="-ml-1" />
                                            <Separator
                                                orientation="vertical"
                                                className="mr-2 h-4"
                                            />
                                            <Breadcrumb>
                                                <BreadcrumbList>
                                                    {path.split('/').map((item, index) => {
                                                        if (
                                                            index === 0 ||
                                                            index === path.split('/').length - 1
                                                        )
                                                            return;
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <BreadcrumbItem key={index}>
                                                                    {
                                                                        index === 1 && (
                                                                            <BreadcrumbPage>
                                                                                {item
                                                                                    .charAt(0)
                                                                                    .toUpperCase() +
                                                                                    item.slice(1)}
                                                                            </BreadcrumbPage>
                                                                        ) // BreadcrumbPage é um componente que estiliza o texto do breadcrumb mas não o deixa "linkável"
                                                                    }
                                                                    {index > 1 && (
                                                                        <BreadcrumbLink
                                                                            href={path
                                                                                .split('/')
                                                                                .slice(0, index + 1)
                                                                                .join('/')}
                                                                        >
                                                                            {item
                                                                                .charAt(0)
                                                                                .toUpperCase() +
                                                                                item.slice(1)}
                                                                        </BreadcrumbLink>
                                                                    )}
                                                                </BreadcrumbItem>
                                                                {index !==
                                                                    path.split('/').length - 2 && (
                                                                    <BreadcrumbSeparator />
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </BreadcrumbList>
                                            </Breadcrumb>
                                        </div>
                                        <div className="ml-auto mr-4 flex items-center gap-2">
                                            <ThemeSwitcher />
                                        </div>
                                    </header>
                                    <main className="w-full flex-1 overflow-y-auto bg-[#f4f4f4] dark:bg-boxdark-2">
                                        <div className="mx-auto max-w-screen-2xl p-4 md:px-2 md:py-6 xl:p-6 2xl:p-10">
                                            <RouteGuard>{children}</RouteGuard>
                                        </div>
                                    </main>
                                    {/* <!-- ===== Main Content End ===== --> */}
                                    <Show
                                        when={
                                            (window.location.href.includes('dev-ativoscvld') ||
                                                window.location.href.includes(
                                                    'https://dev.ativos.com/',
                                                )) &&
                                            showAlert
                                        }
                                    >
                                        <div className="sticky bottom-0 z-9 w-full px-5 py-3 text-center text-white">
                                            <Alert
                                                color="warning"
                                                icon={HiInformationCircle}
                                                className="mb-0 transition-all duration-300"
                                                onDismiss={() => {
                                                    setStyleRelated({ opacity: 0 });
                                                    setTimeout(() => {
                                                        setShowAlert(false);
                                                    }, 300);
                                                }}
                                                style={styleRelated}
                                            >
                                                Você está usando uma versão em desenvolvimento!
                                            </Alert>
                                        </div>
                                    </Show>
                                </div>
                                <TableNotionProvider>
                                    <NewForm />
                                </TableNotionProvider>
                                {/* <!-- ===== Content Area End ===== --> */}
                            </SidebarInset>
                        </SidebarProvider>
                    </div>
                </GeneralUIProvider>
            </DefaultLayoutProvider>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </>
    );
}

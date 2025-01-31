'use client';

import { type LucideIcon } from 'lucide-react';
import React from 'react';
import { Collapsible } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Show from './Show';
import { useContext } from 'react';
import { UserInfoAPIContext } from '@/context/UserInfoContext';

export function NavModule({
    items,
}: {
    items: {
        name: string;
        logo?: LucideIcon;
        fn?: VoidFunction;
    }[];
}) {
    const {
        data: { product },
    } = useContext(UserInfoAPIContext);
    return (
        <Show when={product !== 'wallet'}>
            <SidebarGroup>
                {/* <SidebarGroupLabel>Plataforma</SidebarGroupLabel> */}
                <SidebarMenu>
                    {items.map((item) => (
                        <Collapsible key={item.name} asChild className="group/collapsible">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={item.name}
                                    className={`w-full items-center rounded-lg border border-slate-300 bg-slate-100 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200`}
                                    onClick={item.fn}
                                >
                                    {item.logo && <item.logo />}
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </Show>
    );
}

"use client";

import {
    Calendar,
    CalendarX,
    GraduationCap,
    Home,
    Inbox,
    LayoutGrid,
    LogOut,
    Search,
    Settings,
    Star,
    UsersRound,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";
import { useRouter } from "next/navigation";

const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
];

export default function AppSidebar() {
    const router = useRouter();

    async function handleSignOut() {
        const res = await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            console.error("Sign out failed:", res.status);
            return;
        }

        router.push("/sign-in");
    }

    return (
        <Sidebar>
            {/* Header: Logo & Title */}
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GraduationCap className="size-6" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-bold text-xl tracking-tight italic text-primary">
                            Cyfers
                        </span>
                        <span className="text-[10px] uppercase tracking-widest opacity-60">
                            Studenten Portaal
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            {/* Content: Main Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {[
                            { title: "Home", icon: LayoutGrid },
                            { title: "Cijfers", icon: Star },
                            { title: "Rooster", icon: Calendar },
                            {
                                title: "Verzuim",
                                icon: CalendarX,
                                isActive: true,
                            },
                        ].map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    isActive={item.isActive}
                                    className="py-6 transition-all hover:bg-sidebar-accent"
                                >
                                    <item.icon className="size-5" />
                                    <span className="text-base">
                                        {item.title}
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: Settings & Logout */}
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="py-6 text-muted-foreground">
                                <Settings className="size-5" />
                                <span>Instellingen</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="py-6 text-muted-foreground"
                                onClick={handleSignOut}
                            >
                                <LogOut className="size-5" />
                                <span>Uitloggen</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}

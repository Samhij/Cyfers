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
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
];

export default function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch("/api/student-data");
                if (res.ok) {
                    const data = await res.json();
                    if (data.items && data.items.length > 0) {
                        setStudent(data.items[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch student data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStudent();
    }, []);

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
                {/* Student Info */}
                <div className="mt-2 px-2 border-t pt-4">
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-2 w-16" />
                            </div>
                        </div>
                    ) : student ? (
                        <div className="flex items-center gap-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted overflow-hidden">
                                {student.pasfotoUrl ? (
                                    <img
                                        src={student.pasfotoUrl}
                                        alt="Avatar"
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <UsersRound className="size-4" />
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                <span className="text-sm font-medium truncate">
                                    {student.roepnaam} {student.achternaam}
                                </span>
                                <span className="text-[10px] text-muted-foreground truncate">
                                    {student.leerlingnummer}
                                </span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </SidebarHeader>

            {/* Content: Main Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="space-y-2">
                        {[
                            {
                                title: "Home",
                                url: "/home",
                                icon: LayoutGrid,
                                isActive: pathname === "/home",
                            },
                            {
                                title: "Cijfers",
                                url: "/cijfers",
                                icon: Star,
                                isActive: pathname === "/cijfers",
                            },
                            {
                                title: "Rooster",
                                url: "/rooster",
                                icon: Calendar,
                                isActive: pathname === "/rooster",
                            },
                            {
                                title: "Verzuim",
                                url: "/verzuim",
                                icon: CalendarX,
                                isActive: pathname === "/verzuim",
                            },
                        ].map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    isActive={item.isActive}
                                    className="py-6 transition-all hover:bg-sidebar-accent data-active:rounded-l-sm data-active:text-primary data-active:hover:text-primary data-active:border-l-4 border-primary"
                                    asChild
                                >
                                    <Link href={item.url}>
                                        <item.icon className="size-5" />
                                        <span className="text-base">
                                            {item.title}
                                        </span>
                                    </Link>
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
                            <SidebarMenuButton className="py-6 text-muted-foreground transition-all">
                                <Settings className="size-5" />
                                <span>Instellingen</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuButton className="py-6 text-muted-foreground transition-all hover:text-destructive">
                                        <LogOut className="size-5" />
                                        <span>Uitloggen</span>
                                    </SidebarMenuButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Uitloggen
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Weet je zeker dat je wilt uitloggen?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Annuleren
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button
                                                onClick={handleSignOut}
                                                className="bg-destructive hover:bg-destructive/80 text-white"
                                            >
                                                Uitloggen
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}

"use client";

import ScheduleWidget from "@/components/widgets/schedule-widget";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [welcomeMessage, setWelcomeMessage] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const now = new Date();

        const formatter = new Intl.DateTimeFormat("nl-NL", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        const date = formatter.format(now);
        setFormattedDate(date.charAt(0).toUpperCase() + date.slice(1));

        const hours = now.getHours();
        if (hours < 12) {
            setWelcomeMessage("Goedemorgen");
        } else if (hours < 18) {
            setWelcomeMessage("Goedemiddag");
        } else {
            setWelcomeMessage("Goedenavond");
        }
    }, []);

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch("/api/student-data");
                if (res.status === 401) {
                    router.replace("/session-expired");
                    return;
                }
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
    }, [router]);

    return (
        <div className="px-12 py-10 space-y-6">
            <div className="space-y-1">
                {loading || !student ? (
                    <>
                        <Skeleton className="h-10 w-72 rounded-md" />
                        <Skeleton className="h-6 w-48 rounded-md" />
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-black">
                            {welcomeMessage}, {student.roepnaam}
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium">
                            {formattedDate}
                        </p>
                    </>
                )}
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full flex-1 min-w-0 space-y-6">
                    {/* Left column: for widgets with a larger width */}
                    <ScheduleWidget />
                </div>
                <div className="w-full md:max-w-sm lg:max-w-sm xl:max-w-lg space-y-6">
                    {/* Right column: for widgets with a small width */}
                    <ScheduleWidget />
                </div>
            </div>
        </div>
    );
}

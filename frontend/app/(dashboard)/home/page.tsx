"use client";

import ScheduleWidget from "@/components/schedule-widget";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const formattedDate = formatter.format(now);

    const hours = now.getHours();
    let welcomeMessage: string;

    if (hours < 12) {
        welcomeMessage = "Goedemorgen";
    } else if (hours < 18) {
        welcomeMessage = "Goedemiddag";
    } else {
        welcomeMessage = "Goedenavond";
    }

    if (loading) {
        return <div className="px-12 py-10">Laden...</div>;
    }

    if (!student) {
        return null;
    }

    return (
        <div className="px-12 py-10 space-y-6">
            <div className="space-y-1">
                <h1 className="text-4xl font-black">
                    {welcomeMessage}, {student.roepnaam}
                </h1>
                <p className="text-muted-foreground text-lg font-medium">
                    {formattedDate.charAt(0).toUpperCase() +
                        formattedDate.slice(1)}
                </p>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full flex-1 min-w-0 space-y-6">
                    {/* Left column: for widgets with a larger width */}
                    <ScheduleWidget />
                    <ScheduleWidget />
                </div>
                <div className="w-full lg:max-w-lg space-y-6">
                    {/* Right column: for widgets with a small width */}
                    <ScheduleWidget />
                    <ScheduleWidget />
                </div>
            </div>
        </div>
    );
}

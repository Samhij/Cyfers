"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScheduleGrid, { WeekSchedule } from "@/components/schedule-grid";

// ─── Week helpers ─────────────────────────────────────────────────────────────

function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getMondayOfISOWeek(week: number, year: number): Date {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const monday = new Date(simple);
    monday.setDate(simple.getDate() - (dow <= 4 ? dow - 1 : dow - 8));
    return monday;
}

function getWeekDateRange(week: number, year: number): string {
    const monday = getMondayOfISOWeek(week, year);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const fmt = (d: Date) =>
        d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });

    return `${fmt(monday)} — ${fmt(friday)} ${year}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Rooster() {
    const router = useRouter();
    const currentWeek = getISOWeek(new Date());
    const currentYear = new Date().getFullYear();

    const [week, setWeek] = useState(currentWeek);
    const [year, setYear] = useState(currentYear);
    const [schedule, setSchedule] = useState<WeekSchedule>({});
    const [loading, setLoading] = useState(true);

    const fetchSchedule = useCallback(
        async (w: number) => {
            setLoading(true);
            try {
                const res = await fetch(`/api/schedule/this-week?week=${w}`, {
                    credentials: "include",
                });
                if (res.status === 401) {
                    router.replace("/session-expired");
                    return;
                }
                if (!res.ok) {
                    console.error("Failed to fetch schedule:", res.status);
                    return;
                }
                const data = await res.json();
                setSchedule(data);
            } catch (err) {
                console.error("Error fetching schedule:", err);
            } finally {
                setLoading(false);
            }
        },
        [router]
    );

    useEffect(() => {
        fetchSchedule(week);
    }, [week, fetchSchedule]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") prevWeek();
            if (e.key === "ArrowRight") nextWeek();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    function prevWeek() {
        setWeek((w) => {
            if (w - 1 < 1) {
                setYear((y) => y - 1);
                return 52;
            }
            return w - 1;
        });
    }

    function nextWeek() {
        setWeek((w) => {
            if (w + 1 > 52) {
                setYear((y) => y + 1);
                return 1;
            }
            return w + 1;
        });
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* ── Page header ── */}
            <div className="flex items-center justify-between px-8 pt-8 pb-5 shrink-0">
                {/* Left: title + week info */}
                <div>
                    <h1 className="text-3xl font-black leading-none">Wekelijks Rooster</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-bold bg-white/10 text-foreground px-2.5 py-1 rounded-md">
                            Week {week}
                        </span>
                        <span className="text-sm text-muted-foreground/70">
                            {getWeekDateRange(week, year)}
                        </span>
                    </div>
                </div>

                {/* Right: week navigation */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={prevWeek}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft size={16} />
                        VORIGE WEEK
                    </button>
                    <button
                        onClick={nextWeek}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        VOLGENDE WEEK
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* ── Grid ── */}
            <div className="flex-1 overflow-hidden">
                <ScheduleGrid schedule={schedule} loading={loading} />
            </div>
        </div>
    );
}

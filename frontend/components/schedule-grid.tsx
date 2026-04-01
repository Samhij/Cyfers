"use client";

import { useEffect, useRef, useState } from "react";
import { DoorOpen, LayoutGrid, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Lesson {
    lesuur: number | null;
    lesuurr?: number | null;
    start: string;
    einde: string;
    locatie: string;
    omschrijving: string;
    vaknaam: string;
    bijlagen: unknown[];
    docent?: string | string[] | null;
    type?: string;
}

export type WeekSchedule = {
    [day: string]: Lesson[];
};

interface ScheduleGridProps {
    schedule: WeekSchedule;
    loading?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_LABELS_NL: Record<string, string> = {
    Monday: "MAANDAG",
    Tuesday: "DINSDAG",
    Wednesday: "WOENSDAG",
    Thursday: "DONDERDAG",
    Friday: "VRIJDAG",
};

const GRID_START_HOUR = 8;
const GRID_END_HOUR = 17;
const PX_PER_MINUTE = 1.5;
const GRID_HEIGHT = (GRID_END_HOUR - GRID_START_HOUR) * 60 * PX_PER_MINUTE;
const HOUR_MARKERS = Array.from(
    { length: GRID_END_HOUR - GRID_START_HOUR + 1 },
    (_, i) => GRID_START_HOUR + i,
);
const TIME_COL_WIDTH = 52;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTime(isoString: string) {
    const d = new Date(isoString);
    return d.getHours() * 60 + d.getMinutes();
}

function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function minutesToPx(minutes: number) {
    return (minutes - GRID_START_HOUR * 60) * PX_PER_MINUTE;
}

function durationPx(startMin: number, endMin: number) {
    return (endMin - startMin) * PX_PER_MINUTE;
}

function getLessonType(
    lesson: Lesson,
): "uitval" | "examen" | "pauze" | "normal" {
    const name = (lesson.vaknaam || lesson.omschrijving || "").toLowerCase();
    const type = (lesson.type || "").toLowerCase();
    if (type === "uitval" || name.includes("uitval")) return "uitval";
    if (type === "examen" || name.includes("examen") || name.includes("toets"))
        return "examen";
    if (type === "pauze" || name.includes("pauze")) return "pauze";
    return "normal";
}

function getDocentLabel(docent: Lesson["docent"]): string {
    if (Array.isArray(docent)) {
        const value = docent.find((item) => item && item.trim());
        return value ?? "ZTM";
    }

    if (typeof docent === "string" && docent.trim()) {
        return docent;
    }

    return "ZTM";
}

function getLessonHour(lesson: Lesson): number | null {
    return lesson.lesuur ?? lesson.lesuurr ?? null;
}

function getMondayOfWeek(schedule: WeekSchedule): Date | null {
    for (const day of DAY_ORDER) {
        const lessons = schedule[day];
        if (lessons && lessons.length > 0) {
            const d = new Date(lessons[0].start);
            const dow = d.getDay();
            const monday = new Date(d);
            monday.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
            monday.setHours(0, 0, 0, 0);
            return monday;
        }
    }
    return null;
}

function isToday(date: Date | null): boolean {
    if (!date) return false;
    const now = new Date();
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

// ─── Lesson Card ─────────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: Lesson }) {
    const startMin = parseTime(lesson.start);
    const endMin = parseTime(lesson.einde);
    const top = minutesToPx(startMin);
    const height = Math.max(durationPx(startMin, endMin), 28);
    const type = getLessonType(lesson);
    const durationMin = endMin - startMin;
    const isTiny = durationMin < 25;
    const lesuur = getLessonHour(lesson);
    const lesuurLabel = lesuur != null ? `${lesuur}e uur` : null;
    const docentLabel = getDocentLabel(lesson.docent);

    // ── Pauze ──
    if (type === "pauze") {
        return (
            <div
                className="absolute inset-x-3 rounded-lg flex flex-col items-center justify-center gap-1 bg-white/4 border border-white/8"
                style={{ top, height }}
            >
                <LayoutGrid size={13} className="text-muted-foreground/60" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
                    Pauze
                </span>
            </div>
        );
    }

    // ── Examen ──
    if (type === "examen") {
        return (
            <div
                className="absolute inset-x-3 rounded-lg overflow-hidden bg-[#12121f] border border-indigo-900/60 px-3 py-2 flex flex-col"
                style={{ top, height }}
            >
                <div className="flex items-start justify-between mb-2">
                    <span className="text-[9px] font-black tracking-widest uppercase text-indigo-300 bg-indigo-500/25 px-1.5 py-0.5 rounded-sm">
                        EXAMEN
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 font-mono tabular-nums">
                        {formatTime(lesson.start)} - {formatTime(lesson.einde)}
                    </span>
                </div>
                <span className="font-bold text-base leading-snug text-foreground">
                    {lesson.vaknaam || lesson.omschrijving || "—"}
                </span>
                <div className="mt-auto flex flex-col gap-1">
                    {lesson.locatie && (
                        <div className="flex items-center gap-1.5 text-muted-foreground/70">
                            <LayoutGrid size={11} />
                            <span className="text-xs text-white font-medium">
                                {lesson.locatie}
                            </span>
                        </div>
                    )}
                    {docentLabel !== "ZTM" && (
                        <div className="flex items-center gap-1.5 text-muted-foreground/70">
                            <Users size={11} />
                            <span className="text-[11px] font-medium">
                                {docentLabel}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Uitval ──
    if (type === "uitval") {
        return (
            <div
                className="absolute inset-x-3 rounded-lg overflow-hidden bg-[#181920] border border-white/8 px-3"
                style={{ top, height }}
            >
                <div
                    className={cn(
                        "flex flex-col h-full",
                        isTiny ? "justify-center" : "pt-2 pb-2",
                    )}
                >
                    {!isTiny && (
                        <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] font-black tracking-widest uppercase text-red-400">
                                UITVAL
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 font-mono tabular-nums">
                                {formatTime(lesson.start)}
                            </span>
                        </div>
                    )}
                    <span className="font-bold text-[13px] leading-snug text-muted-foreground/60 truncate">
                        {lesson.vaknaam || lesson.omschrijving || "—"}
                    </span>
                    {!isTiny && (
                        <div className="flex items-center justify-between mt-auto">
                            {lesson.locatie ? (
                                <div className="flex items-center gap-1 text-muted-foreground/40">
                                    <LayoutGrid size={10} />
                                    <span className="text-xs text-white font-medium">
                                        {lesson.locatie}
                                    </span>
                                </div>
                            ) : (
                                <div />
                            )}
                            {docentLabel !== "ZTM" && (
                                <span className="text-[10px] font-bold uppercase text-muted-foreground/40 tracking-wide">
                                    {docentLabel}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Normal ──
    return (
        <div
            className="absolute inset-x-3 rounded-lg overflow-hidden bg-[#181920] border border-white/8 flex"
            style={{ top, height }}
        >
            {/* Left accent bar */}
            <div className="w-0.75 shrink-0 bg-indigo-500 rounded-l-lg" />

            <div
                className={cn(
                    "flex flex-col flex-1 min-w-0 px-3",
                    isTiny ? "justify-center" : "pt-2 pb-2",
                )}
            >
                {!isTiny && (
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black tracking-widest uppercase text-indigo-400">
                            {lesuurLabel ?? ""}
                        </span>
                        <span className="text-[10px] text-indigo-300 font-semibold tabular-nums">
                            {formatTime(lesson.start)}
                        </span>
                    </div>
                )}
                <span className="font-bold text-base leading-snug text-foreground truncate">
                    {lesson.vaknaam || lesson.omschrijving || "—"}
                </span>
                {!isTiny && (
                    <div className="flex items-center justify-between mt-auto">
                        {lesson.locatie ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground/50">
                                <DoorOpen size={12} />
                                <span className="text-xs text-white font-medium">
                                    {lesson.locatie}
                                </span>
                            </div>
                        ) : (
                            <div />
                        )}
                        <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wide">
                            {lesson.docent}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
    return (
        <>
            {[
                {
                    top: minutesToPx(8 * 60),
                    h: durationPx(8 * 60, 9 * 60 + 20),
                },
                {
                    top: minutesToPx(9 * 60 + 20),
                    h: durationPx(9 * 60 + 20, 10 * 60 + 10),
                },
                {
                    top: minutesToPx(11 * 60),
                    h: durationPx(11 * 60, 11 * 60 + 50),
                },
            ].map((pos, i) => (
                <div
                    key={i}
                    className="absolute inset-x-3 rounded-lg bg-white/5 animate-pulse"
                    style={{ top: pos.top, height: pos.h }}
                />
            ))}
        </>
    );
}

// ─── Current Time Line ────────────────────────────────────────────────────────

function CurrentTimeLine() {
    const [top, setTop] = useState<number | null>(null);

    useEffect(() => {
        function update() {
            const now = new Date();
            const min = now.getHours() * 60 + now.getMinutes();
            if (min >= GRID_START_HOUR * 60 && min <= GRID_END_HOUR * 60) {
                setTop(minutesToPx(min));
            } else {
                setTop(null);
            }
        }
        update();
        const id = setInterval(update, 60_000);
        return () => clearInterval(id);
    }, []);

    if (top === null) return null;

    return (
        <div
            className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
            style={{ top }}
        >
            <div className="w-2 h-2 rounded-full bg-primary shrink-0 -ml-1" />
            <div className="flex-1 border-t border-primary opacity-80" />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScheduleGrid({
    schedule,
    loading = false,
}: ScheduleGridProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = minutesToPx(GRID_START_HOUR * 60);
        }
    }, []);

    const monday = getMondayOfWeek(schedule);

    function getDateForDay(dayKey: string): Date | null {
        if (!monday) return null;
        const offset = DAY_ORDER.indexOf(dayKey);
        if (offset < 0) return null;
        const d = new Date(monday);
        d.setDate(monday.getDate() + offset);
        return d;
    }

    return (
        // Single scrollable container — time col + day cols all scroll together
        <div ref={scrollRef} className="h-full overflow-auto bg-[#111113]">
            <div
                className="flex"
                style={{ minWidth: DAY_ORDER.length * 160 + TIME_COL_WIDTH }}
            >
                {/* ── Time axis ── */}
                <div
                    className="shrink-0 flex flex-col"
                    style={{ width: TIME_COL_WIDTH }}
                >
                    {/* Blank corner above day headers */}
                    <div
                        className="shrink-0 sticky top-0 z-30 bg-[#111113]"
                        style={{ height: 64 }}
                    />
                    {/* Hour labels */}
                    <div className="relative" style={{ height: GRID_HEIGHT }}>
                        {HOUR_MARKERS.map((hour) => (
                            <div
                                key={hour}
                                className="absolute right-0 pr-3"
                                style={{ top: minutesToPx(hour * 60) - 7 }}
                            >
                                <span className="text-[11px] text-muted-foreground/40 font-mono leading-none">
                                    {String(hour).padStart(2, "0")}:00
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Day columns ── */}
                {DAY_ORDER.map((day) => {
                    const lessons = schedule[day] ?? [];
                    const date = getDateForDay(day);
                    const today = isToday(date);
                    const dateLabel = date
                        ? date
                              .toLocaleDateString("nl-NL", {
                                  day: "numeric",
                                  month: "short",
                              })
                              .toUpperCase()
                        : "";

                    return (
                        <div key={day} className="flex-1 flex flex-col min-w-0">
                            {/* Sticky day header */}
                            <div
                                className={cn(
                                    "sticky top-0 z-20 shrink-0 flex flex-col items-center justify-center bg-[#111113] border-b border-white/6",
                                    today ? "border-b-indigo-500/50" : "",
                                )}
                                style={{ height: 64 }}
                            >
                                <span
                                    className={cn("text-xl tracking-widest italic",
                                        today ? "text-indigo-400 font-black" : "text-foreground/90",
                                    )}
                                >
                                    {DAY_LABELS_NL[day]}
                                </span>
                                <span
                                    className="text-xs font-semibold mt-0.5 text-muted-foreground"
                                >
                                    {dateLabel}
                                </span>
                            </div>

                            {/* Column body */}
                            <div
                                className="relative border-l border-white/5"
                                style={{ height: GRID_HEIGHT }}
                            >
                                {/* Hour grid lines */}
                                {HOUR_MARKERS.map((hour) => (
                                    <div
                                        key={hour}
                                        className="absolute left-0 right-0 border-t border-white/5"
                                        style={{ top: minutesToPx(hour * 60) }}
                                    />
                                ))}

                                {/* Current time line */}
                                {today && <CurrentTimeLine />}

                                {/* Cards */}
                                {loading ? (
                                    <GridSkeleton />
                                ) : (
                                    lessons.map((lesson, i) => (
                                        <LessonCard key={i} lesson={lesson} />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

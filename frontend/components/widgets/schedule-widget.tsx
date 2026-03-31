"use client";

import { CalendarDays, GraduationCap, X } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lesson } from "@/components/schedule-grid";

export default function ScheduleWidget() {
    const [loading, setLoading] = useState<boolean>(true);
    const [schedule, setSchedule] = useState<Lesson[] | null>(null);

    function getFormattedTime(isoString: string) {
        const date = new Date(isoString);
        const time = date.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        return time.toString();
    }

    function getLessonState(item: { start: string; einde: string }) {
        const now = Date.now();
        const start = new Date(item.start).getTime();
        const end = new Date(item.einde).getTime();

        if (end < now) {
            return {
                name: "past",
                cardClass: "opacity-60 blur-none",
                titleClass: "text-muted-foreground line-through",
                timeClass: "text-muted-foreground",
            };
        }

        if (start <= now && now <= end) {
            return {
                name: "current",
                cardClass: "ring-2 ring-primary/80 bg-primary/10",
                titleClass: "text-primary font-semibold",
                timeClass: "text-primary",
            };
        }

        return {
            name: "upcoming",
            cardClass: "",
            titleClass: "text-white",
            timeClass: "text-muted-foreground",
        };
    }

    async function getSchedule() {
        setLoading(true);
        const res = await fetch("/api/schedule/today", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error("Failed to fetch today's schedule:", res.status);
            return;
        }
        const data = await res.json();
        setSchedule(data);
        setLoading(false);
    }

    useEffect(() => {
        getSchedule();
    }, []);

    const hasLessons = schedule?.length != 0;
    const allLessonsPast =
        hasLessons &&
        schedule?.every((item) => getLessonState(item).name === "past");

    if (loading) {
        return (
            <Card className="bg-[#19191c] w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-bold leading-7">
                        Rooster van vandaag
                    </CardTitle>
                    <CardContent className="mt-6 mb-4">
                        <div className="space-y-8">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 items-center"
                                >
                                    <Skeleton className="size-11 rounded-lg shrink-0" />
                                    <div className="flex flex-col gap-2 w-full">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-transparent">
                        <Skeleton className="w-full h-11 mt-2 rounded-md" />
                    </CardFooter>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-[#19191c] w-full">
            <CardHeader>
                <CardTitle className="text-lg font-bold leading-7">
                    Rooster van vandaag
                </CardTitle>
                <CardContent className="mt-4 mb-3">
                    <ul className="relative isolate space-y-3">
                        {hasLessons && !allLessonsPast ? (
                            schedule?.map((item, key) => {
                                const isUitval = item.type === "uitval";
                                const lessonState = getLessonState(item);
                                return (
                                    <li
                                        key={key}
                                        className={`relative z-10 flex justify-between rounded-xl p-3 ${lessonState.cardClass}`}
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div
                                                className={`relative z-10 rounded-lg p-2 w-11 h-11 flex items-center justify-center text-xl font-bold ${isUitval ? "bg-red-500/20 text-red-400" : "bg-linear-to-bl from-primary to-primary/50 text-black"}`}
                                            >
                                                {isUitval
                                                    ? "X"
                                                    : (item.lesuur ?? "?")}
                                            </div>
                                            <div className="flex flex-col">
                                                <span
                                                    className={`font-bold leading-5 ${isUitval ? "line-through text-muted-foreground" : lessonState.titleClass}`}
                                                >
                                                    {item.vaknaam}
                                                </span>
                                                <span
                                                    className={`text-xs font-normal uppercase leading-4 tracking-wide ${lessonState.timeClass}`}
                                                >
                                                    {isUitval ? (
                                                        <span className="text-red-400 font-semibold">
                                                            Uitval
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {getFormattedTime(
                                                                item.start,
                                                            )}
                                                            {" - "}
                                                            {getFormattedTime(
                                                                item.einde,
                                                            )}
                                                            {item.locatie && (
                                                                <span>
                                                                    {" "}
                                                                    &#x2022;
                                                                </span>
                                                            )}{" "}
                                                            {item.locatie}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li>
                                <div className="flex gap-4 items-center">
                                    <div className="relative z-10 bg-linear-to-bl from-primary to-primary/50 rounded-lg p-2 text-black">
                                        <GraduationCap size={25} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold leading-5">
                                            Geen lessen vandaag!
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </CardContent>
                <CardFooter className="bg-transparent">
                    <Link
                        href="/rooster"
                        className="font-bold leading-4 w-full"
                    >
                        <Button
                            variant="secondary"
                            className="w-full py-6 mt-2"
                        >
                            <CalendarDays /> Volledig rooster bekijken
                        </Button>
                    </Link>
                </CardFooter>
            </CardHeader>
        </Card>
    );
}

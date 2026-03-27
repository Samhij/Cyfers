"use client";

import { CalendarDays, GraduationCap } from "lucide-react";
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

export default function ScheduleWidget() {
    const [loading, setLoading] = useState<boolean>(true);
    const [schedule, setSchedule] = useState<Array<{
        vaknaam: string;
        start: string;
        einde: string;
        locatie: string;
    }> | null>(null);

    function getFormattedTime(isoString: string) {
        const date = new Date(isoString);
        const time = date.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        return time.toString();
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
                <CardContent className="mt-6 mb-4">
                    <ul className="relative isolate space-y-8 before:absolute before:left-5 before:top-5 before:bottom-5 before:z-0 before:w-px before:bg-white/10">
                        {schedule?.length != 0 ? (
                            schedule?.map((item, key) => (
                                <li
                                    key={key}
                                    className="relative z-10 flex justify-between"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="relative z-10 bg-linear-to-bl from-primary to-primary/50 rounded-lg p-2 text-black">
                                            <GraduationCap size={25} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold leading-5">
                                                {item.vaknaam}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-normal uppercase leading-4 tracking-wide">
                                                {getFormattedTime(item.start)}
                                                {" - "}
                                                {getFormattedTime(item.einde)}
                                                {item.locatie && (
                                                    <span>{" "}&#x2022;</span>
                                                )}{" "}
                                                {item.locatie}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
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

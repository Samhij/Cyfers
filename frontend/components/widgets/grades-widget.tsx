"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface Grade {
    date: string;
    subject: string;
    grade: number;
    period: number;
}

function Grade({ item }: { item: Grade }) {
    const gradeColorClass = item.grade < 5.5
        ? "text-red-500"
        : item.grade < 8
            ? "text-white"
            : "text-green-500";

    return (
        <Card className="bg-[#262528] py-6 px-2">
            <CardHeader className="space-y-4">
                <CardTitle className="flex items-center justify-between">
                    <span className={`${gradeColorClass} text-4xl font-extrabold`}>
                        {item.grade}
                    </span>
                    <span className="text-xs font-bold uppercase bg-[#33323D] p-2 rounded-full">
                        {item.subject}
                    </span>
                </CardTitle>

                {/**
                 * @TODO Replace 'Meetkunde' with actual test description (wait for Thijmen to add to somtoday library)
                 */}
                <span>Toets: Meetkunde</span>
                <Progress value={item.grade * 10} className="h-2 bg-gray-900" />
            </CardHeader>
        </Card>
    );
}

export default function GradesWidget() {
    const [loading, setLoading] = useState<boolean>(true);
    const [grades, setGrades] = useState<Array<Grade> | null>(null);

    async function getGrades() {
        setLoading(true);
        const res = await fetch("/api/grades", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error("Failed to fetch grades:", res.status);
            return;
        }
        const data = await res.json();
        setGrades(data);
        setLoading(false);
    }

    useEffect(() => {
        getGrades();
    }, []);

    if (loading) {
        return (
            <Card className="bg-[#19191c]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between px-4">
                        <span className="text-lg font-bold">Recente cijfers</span>
                        <Skeleton className="h-5 w-24" />
                    </CardTitle>
                    <CardContent className="grid grid-cols-1 gap-4 place-items-center mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div className="w-full" key={i}>
                                <Skeleton className="h-28 rounded-lg w-full" />
                            </div>
                        ))}
                    </CardContent>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="bg-[#19191c] pb-8">
            <CardHeader>
                <CardTitle className="flex items-center justify-between px-4">
                    <span className="text-lg font-bold">Recente cijfers</span>
                    <Link
                        href="/cijfers"
                        className="text-primary text-sm font-semibold"
                    >
                        Alles inzien &rarr;
                    </Link>
                </CardTitle>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center mt-4">
                    {grades?.slice(0, 4).map((item) => (
                        <div
                            className="w-full"
                            key={`${item.subject}-${item.date}-${item.grade}`}
                        >
                            <Grade item={item} />
                        </div>
                    ))}
                </CardContent>
            </CardHeader>
        </Card>
    );
}

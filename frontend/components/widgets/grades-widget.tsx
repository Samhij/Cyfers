"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";

interface Grade {
    date: string;
    subject: string;
    grade: number;
    period: number;
}

function formatPublishedDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    const now = new Date();
    const differenceInDays = Math.max(
        0,
        Math.floor(
            (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
    );

    if (differenceInDays < 7) {
        return `${differenceInDays} ${differenceInDays === 1 ? "dag" : "dagen"} geleden`;
    }

    if (differenceInDays < 30) {
        const weeks = Math.max(1, Math.round(differenceInDays / 7));
        return `${weeks} ${weeks === 1 ? "week" : "weken"} geleden`;
    }

    const months = Math.max(1, Math.round(differenceInDays / 30));
    return `${months} ${months === 1 ? "maand" : "maanden"} geleden`;
}

function GradeCard({
    item,
    compact = false,
}: {
    item: Grade;
    compact?: boolean;
}) {
    const gradeColorClass =
        item.grade < 5.5
            ? "text-red-500"
            : item.grade < 8
              ? "text-white"
              : "text-green-500";

    return (
        <Card className="bg-[#262528] py-6 px-2">
            <CardHeader className="space-y-2">
                <CardTitle className="flex items-center justify-between">
                    <span
                        className={`${gradeColorClass} text-4xl font-extrabold`}
                    >
                        {item.grade}
                    </span>
                    <span className="text-xs font-bold uppercase bg-[#33323D] px-3 py-2 rounded-full">
                        {item.subject}
                    </span>
                </CardTitle>
                <span className="text-muted-foreground">
                    {formatPublishedDate(item.date)}
                </span>
                {!compact && (
                    <Progress
                        value={item.grade * 10}
                        className="h-2 bg-gray-900"
                    />
                )}
            </CardHeader>
        </Card>
    );
}

export default function GradesWidget({
    amount,
    columns,
    compact = false,
}: {
    amount: number;
    columns: number;
    compact?: boolean;
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const [grades, setGrades] = useState<Array<Grade> | null>(null);

    async function getGrades() {
        setLoading(true);

        try {
            const res = await fetch("/api/grades", {
                credentials: "include",
            });
            if (!res.ok) {
                console.error("Failed to fetch grades:", res.status);
                setGrades(null);
                return;
            }

            const data = await res.json();
            setGrades(data);
        } catch (error) {
            console.error("Failed to fetch grades:", error);
            setGrades(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getGrades();
    }, []);

    if (loading) {
        return (
            <Card className="bg-[#19191c]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between px-4">
                        <span className="text-lg font-bold">
                            Recente cijfers
                        </span>
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
                    <span className="text-2xl my-2 font-bold">
                        Recente cijfers
                    </span>
                </CardTitle>
                <CardContent
                    className={`grid grid-cols-${columns} gap-4 place-items-center mt-4`}
                >
                    {grades?.slice(0, amount).map((item) => (
                        <div
                            className="w-full"
                            key={`${item.subject}-${item.date}-${item.grade}`}
                        >
                            <GradeCard item={item} compact={compact} />
                        </div>
                    ))}
                </CardContent>
            </CardHeader>
        </Card>
    );
}

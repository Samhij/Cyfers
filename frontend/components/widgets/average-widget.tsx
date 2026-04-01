"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function AverageWidget() {
    const [loading, setLoading] = useState<boolean>(true);
    const [average, setAverage] = useState<number | null>(null);

    function formatAverage(average: number) {
        return (Math.round(average * 10) / 10).toFixed(1);
    }

    async function getAverage() {
        setLoading(true);
        const res = await fetch("/api/grades/subjects", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error("Failed to fetch subjects:", res.status);
        }
        const data = await res.json();
        const values = Object.values(data) as Array<{ average: number }>;
        const total = values.length
            ? values.reduce((sum, subject) => sum + subject.average, 0) /
              values.length
            : null;
        setAverage(total);
        setLoading(false);
    }

    useEffect(() => {
        getAverage();
    }, []);

    if (loading)
        return (
            <div className="bg-[#19191C] border-l-4 border-l-primary rounded-md p-4 flex flex-col space-y-2">
                <span className="text-muted-foreground text-center text-sm font-bold uppercase leading-4">
                    Totaalgemiddelde
                </span>
                <span className="text-primary text-2xl font-black leading-8">
                    <Skeleton className="h-8 max-w-10" />
                </span>
            </div>
        );

    return (
        <div className="bg-[#19191C] border-l-4 border-l-primary rounded-md p-4 flex flex-col space-y-2">
            <span className="text-muted-foreground text-center text-sm font-bold uppercase leading-4">
                Totaalgemiddelde
            </span>
            <span className="text-primary text-2xl font-black leading-8">
                {formatAverage(average ?? 0)}
            </span>
        </div>
    );
}

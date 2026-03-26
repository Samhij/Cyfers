"use client";

import StudentInfoWidget from "@/components/widgets/student-info-widget";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Gebruiker() {
    const [student, setStudent] = useState<any>(null);
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
            }
        }
        fetchStudent();
    }, [router]);

    return (
        <div className="px-12 py-10 space-y-6">
            <div className="space-y-1">
                <h1 className="text-4xl font-black">Accountoverzicht</h1>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full flex-1 min-w-0 space-y-6">
                    {/* Left column: for widgets with a larger width */}
                    {student && <StudentInfoWidget student={student} />}
                </div>
                <div className="w-full md:max-w-sm lg:max-w-sm xl:max-w-lg space-y-6">
                    {/* Right column: for widgets with a small width */}
                </div>
            </div>
        </div>
    );
}

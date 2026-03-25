"use client";

import { Hand, Waves } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch("/api/student-data");
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
    }, []);

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const formattedDate = formatter.format(now);
    console.log(formattedDate);

    const hours = now.getHours();
    let welcomeMessage: string;

    if (hours < 12) {
        welcomeMessage = "Goedemorgen";
    } else if (hours < 18) {
        welcomeMessage = "Goedemiddag";
    } else {
        welcomeMessage = "Goedenavond";
    }

    return (
        <div className="px-8 py-6">
            {student && (
                <div className="space-y-1">
                    <h1 className="text-4xl font-black">
                        {welcomeMessage}, {student.roepnaam}
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">{formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</p>
                </div>
            )}
        </div>
    );
}

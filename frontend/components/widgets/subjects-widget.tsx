"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import {
    Atom,
    BookOpen,
    Dumbbell,
    FlaskConical,
    Globe,
    GraduationCap,
    Languages,
    LucideIcon,
    Monitor,
    Sigma,
    Utensils,
} from "lucide-react";
import { slugify } from "@/lib/slugify";

interface Subject {
    grades: number[];
    average: number;
}

type Subjects = Record<string, Subject>;

const subjectIconMap: Array<{ keywords: string[]; icon: LucideIcon }> = [
    { keywords: ["informatica", "computer", "ict"], icon: Monitor },
    { keywords: ["nederland", "taal", "english", "engels"], icon: Languages },
    { keywords: ["wisk", "math", "algebra", "meetkunde"], icon: Sigma },
    { keywords: ["scheikunde", "chem", "chemie"], icon: FlaskConical },
    {
        keywords: ["natuurkunde", "physics", "nlt", "nat leven techn"],
        icon: Atom,
    },
    { keywords: ["physical education", "gym", "sport", "lo"], icon: Dumbbell },
    { keywords: ["global studies", "aardrijks", "geografie"], icon: Globe },
    { keywords: ["ckv", "kunst", "culture"], icon: GraduationCap },
    { keywords: ["biologie", "biology"], icon: Utensils },
];

export default function SubjectsWidget() {
    const [loading, setLoading] = useState<boolean>(true);
    const [subjects, setSubjects] = useState<Subjects | null>(null);

    function formatAverage(average: number) {
        return (Math.round(average * 10) / 10).toFixed(1);
    }

    function getSubjectIcon(name: string) {
        const normalizedName = name.toLowerCase();
        const match = subjectIconMap.find(({ keywords }) =>
            keywords.some((keyword) => normalizedName.includes(keyword)),
        );

        return match?.icon ?? BookOpen;
    }

    async function getSubjects() {
        setLoading(true);
        const res = await fetch("/api/grades/subjects", {
            credentials: "include",
        });
        if (!res.ok) {
            console.error("Failed to fetch subjects:", res.status);
        }
        const data = await res.json();
        setSubjects(data);
        setLoading(false);
    }

    useEffect(() => {
        getSubjects();
    }, []);

    if (loading)
        return (
            <Card className="bg-[#19191c] px-2 py-6 animate-pulse">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Alle vakken
                    </CardTitle>
                </CardHeader>
                <CardContent className="mt-2 space-y-2">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 bg-[#262528] rounded-lg p-3 flex items-center justify-between"
                        >
                            <div className="h-10 w-10 bg-[#33323d] rounded" />
                            <div className="h-6 w-10 bg-[#33323d] rounded" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );

    return (
        <Card className="bg-[#19191c] px-2 py-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Alle vakken
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-2">
                <ul className="space-y-2">
                    {Object.entries(subjects ?? {}).map(([name, subject]) => {
                        const Icon = getSubjectIcon(name);

                        return (
                            <li key={name}>
                                <Link
                                    href={`/cijfers/${slugify(name)}`}
                                    className="bg-[#262528] hover:bg-[#323135] transition-all duration-100 p-4 rounded-lg flex items-center justify-between"
                                >
                                    <span className="text-xl font-semibold flex items-center gap-4">
                                        <div className="bg-primary p-2 rounded-lg">
                                            <Icon className="size-6 text-black" />
                                        </div>
                                        {name}
                                    </span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatAverage(subject.average)}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}

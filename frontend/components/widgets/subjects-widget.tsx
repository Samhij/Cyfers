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
import { formatGrade } from "@/lib/format-grade";

interface Subject {
    grades: number[];
    average: number;
}

type Subjects = Record<string, Subject>;

interface SubjectsWidgetProps {
    columns?: number;
    rows?: number;
}

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

export default function SubjectsWidget({
    columns = 1,
    rows,
}: SubjectsWidgetProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [subjects, setSubjects] = useState<Subjects | null>(null);

    const gridStyle = {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...(rows ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` } : {}),
    };

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
                <CardContent className="mt-2 grid gap-2" style={gridStyle}>
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
                <ul className="grid gap-2" style={gridStyle}>
                    {Object.entries(subjects ?? {}).map(([name, subject]) => {
                        const Icon = getSubjectIcon(name);

                        return (
                            <li key={name} className="min-w-0">
                                <Link
                                    href={`/cijfers/${slugify(name)}`}
                                    className="flex h-full items-center justify-between rounded-lg bg-[#262528] p-4 transition-all duration-100 hover:bg-[#323135]"
                                >
                                    <div className="flex min-w-0 items-center gap-4 text-xl font-semibold">
                                        <div className="rounded-lg bg-primary p-2">
                                            <Icon className="size-6 text-black" />
                                        </div>
                                        <span className="truncate">{name}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatGrade(subject.average)}
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

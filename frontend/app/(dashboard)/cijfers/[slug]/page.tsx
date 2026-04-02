import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
    ArrowLeft,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import GradeCalculators from "@/components/widgets/grade-calculators-widget";
import { getBackendUrl } from "@/lib/backend-url";
import { slugify } from "@/lib/slugify";

interface Grade {
    date: string;
    subject: string;
    grade: number;
    period: string | number;
}

function formatGrade(grade: number) {
    return (Math.round(grade * 10) / 10).toFixed(1);
}

function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(parsedDate);
}

function cookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
    return cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");
}

const subjectSlugAliases: Record<string, string[]> = {
    english: ["engels"],
    engels: ["english"],
};

function matchesSubjectSlug(subjectSlug: string, requestedSlug: string) {
    if (subjectSlug === requestedSlug) {
        return true;
    }

    return (
        (subjectSlugAliases[requestedSlug] ?? []).includes(subjectSlug) ||
        (subjectSlugAliases[subjectSlug] ?? []).includes(requestedSlug)
    );
}

export default async function SubjectPage({
    params,
}: {
    params: { slug: string } | Promise<{ slug: string }>;
}) {
    const resolvedParams = await Promise.resolve(params);
    const requestedSlug = slugify(resolvedParams.slug);

    const cookieStore = await cookies();
    const response = await fetch(`${getBackendUrl()}/grades`, {
        method: "GET",
        headers: {
            Cookie: cookieHeader(cookieStore),
        },
        cache: "no-store",
    });

    if (response.status === 401) {
        redirect("/session-expired");
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch grades: ${response.status}`);
    }

    const grades = (await response.json()) as Grade[];
    const subjectGrades = grades.filter(
        (grade) => matchesSubjectSlug(slugify(grade.subject), requestedSlug),
    );

    if (!subjectGrades.length) {
        notFound();
    }

    const subjectName = subjectGrades[0].subject;
    const sortedGrades = [...subjectGrades].sort(
        (left, right) =>
            new Date(right.date).getTime() - new Date(left.date).getTime(),
    );
    const average =
        sortedGrades.reduce((sum, grade) => sum + grade.grade, 0) /
        sortedGrades.length;
    const highestGrade = sortedGrades.reduce((best, grade) =>
        grade.grade > best.grade ? grade : best,
    );
    const lowestGrade = sortedGrades.reduce((worst, grade) =>
        grade.grade < worst.grade ? grade : worst,
    );
    const latestGrade = sortedGrades[0];
    const passingCount = sortedGrades.filter((grade) => grade.grade >= 5.5)
        .length;
    const progressValue = Math.max(0, Math.min(100, average * 10));

    return (
        <div className="px-6 py-10 sm:px-8 lg:px-12 space-y-8">
                <Button asChild variant="outline" className="gap-2">
                    <Link href="/cijfers">
                        <ArrowLeft className="h-4 w-4" />
                        Terug naar cijfers
                    </Link>
                </Button>

            <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
                <Card className="bg-[#19191c] border-border/60">
                    <CardHeader className="space-y-3">
                        <CardTitle className="text-3xl font-black sm:text-4xl">
                            {subjectName}
                        </CardTitle>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            Hier zie je al je cijfers voor het vak {subjectName}.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="rounded-xl border border-border/60 bg-background/80 p-5">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-muted-foreground">
                                        Gemiddelde
                                    </p>
                                    <div className="mt-1 flex items-end gap-3">
                                        <span className="text-5xl font-black text-primary">
                                            {formatGrade(average)}
                                        </span>
                                        <span className="pb-1 text-sm text-muted-foreground">
                                            uit {sortedGrades.length} cijfers
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-sm text-muted-foreground">
                                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                                    {passingCount} voldoende cijfers
                                </div>
                            </div>

                            <Progress value={progressValue} className="mt-5 h-2" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Laatste cijfer
                                </p>
                                <p className="mt-2 text-2xl font-black text-foreground">
                                    {formatGrade(latestGrade.grade)}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatDate(latestGrade.date)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Hoogste cijfer
                                </p>
                                <p className="mt-2 text-2xl font-black text-foreground">
                                    {formatGrade(highestGrade.grade)}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatDate(highestGrade.date)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Laagste cijfer
                                </p>
                                <p className="mt-2 text-2xl font-black text-foreground">
                                    {formatGrade(lowestGrade.grade)}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatDate(lowestGrade.date)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#19191c] border-border/60">
                    <CardHeader className="space-y-3">
                        <CardTitle className="text-xl font-bold">
                            Snel overzicht
                        </CardTitle>
                        <p className="text-sm leading-6 text-muted-foreground">
                            De belangrijkste feiten voor dit vak in één kaart.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Aantal cijfers
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {sortedGrades.length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Voldoende cijfers
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {passingCount}
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Gemiddelde
                            </span>
                            <span className="text-lg font-bold text-primary">
                                {formatGrade(average)}
                            </span>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <CalendarDays className="h-4 w-4 text-sky-400" />
                                Meest recente beoordeling
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {formatDate(latestGrade.date)} in periode {latestGrade.period}.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <GradeCalculators
                subjectName={subjectName}
                currentAverage={average}
                currentWeight={sortedGrades.length}
            />

            <Card className="bg-[#19191c] border-border/60">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Alle cijfers voor {subjectName}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {sortedGrades.map((grade) => (
                        <div
                            key={`${grade.subject}-${grade.date}-${grade.grade}`}
                            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="space-y-1">
                                <p className="text-base font-semibold text-foreground">
                                    {formatDate(grade.date)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Periode {grade.period}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                <span className="text-2xl font-black text-primary">
                                    {formatGrade(grade.grade)}
                                </span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
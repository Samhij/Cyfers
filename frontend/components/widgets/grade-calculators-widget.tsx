"use client";

import { useState } from "react";
import { Calculator, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function parseDecimal(value: string) {
    const normalized = value.replace(",", ".").trim();

    if (!normalized) {
        return Number.NaN;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function formatNumber(value: number) {
    const rounded = Math.round(value * 100) / 100;
    return rounded
        .toFixed(2)
        .replace(/\.0+$/, "")
        .replace(/(\.[1-9]*)0+$/, "$1");
}

function calculateNewAverage(
    currentAverage: number,
    currentWeight: number,
    grade: number,
    gradeWeight: number,
) {
    return (
        (currentAverage * currentWeight + grade * gradeWeight) /
        (currentWeight + gradeWeight)
    );
}

function calculateRequiredGrade(
    currentAverage: number,
    currentWeight: number,
    targetAverage: number,
    nextWeight: number,
) {
    return (
        (targetAverage * (currentWeight + nextWeight) -
            currentAverage * currentWeight) /
        nextWeight
    );
}

type GradeCalculatorsProps = {
    subjectName: string;
    currentAverage: number;
    currentWeight: number;
};

export default function GradeCalculators({
    subjectName,
    currentAverage,
    currentWeight,
}: GradeCalculatorsProps) {
    const [newGradeInput, setNewGradeInput] = useState("");
    const [newGradeWeightInput, setNewGradeWeightInput] = useState("1");
    const [targetAverageInput, setTargetAverageInput] = useState("");
    const [nextWeightInput, setNextWeightInput] = useState("1");

    const parsedNewGrade = parseDecimal(newGradeInput);
    const parsedNewGradeWeight = parseDecimal(newGradeWeightInput);
    const parsedTargetAverage = parseDecimal(targetAverageInput);
    const parsedNextWeight = parseDecimal(nextWeightInput);

    const canCalculateNewAverage =
        Number.isFinite(parsedNewGrade) &&
        Number.isFinite(parsedNewGradeWeight) &&
        parsedNewGradeWeight > 0;

    const canCalculateRequiredGrade =
        Number.isFinite(parsedTargetAverage) &&
        Number.isFinite(parsedNextWeight) &&
        parsedNextWeight > 0;

    const newAverage = canCalculateNewAverage
        ? calculateNewAverage(
              currentAverage,
              currentWeight,
              parsedNewGrade,
              parsedNewGradeWeight,
          )
        : null;

    const requiredGrade = canCalculateRequiredGrade
        ? calculateRequiredGrade(
              currentAverage,
              currentWeight,
              parsedTargetAverage,
              parsedNextWeight,
          )
        : null;

    const requiredGradeOutOfRange =
        requiredGrade !== null && (requiredGrade < 1 || requiredGrade > 10);

    return (
        <section className="space-y-4">
            <div className="max-w-2xl space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                    Bereken je nieuwe gemiddelde of wat je nodig hebt
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Test een nieuw cijfer of een doelgemiddelde zonder zelf te
                    rekenen.
                </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                <Card size="sm" className="border-border/60 bg-[#19191c]">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-xl font-bold">
                            Wat gebeurt er met je gemiddelde?
                        </CardTitle>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Huidig gemiddelde: {formatNumber(currentAverage)}{" "}
                            uit {currentWeight} cijfers.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="new-grade-input"
                                    className="text-xs uppercase tracking-wide text-muted-foreground"
                                >
                                    Cijfer
                                </Label>
                                <Input
                                    id="new-grade-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={newGradeInput}
                                    onChange={(event) =>
                                        setNewGradeInput(event.target.value)
                                    }
                                    placeholder="Bijv. 7,3"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="new-grade-weight-input"
                                    className="text-xs uppercase tracking-wide text-muted-foreground"
                                >
                                    Gewicht
                                </Label>
                                <Input
                                    id="new-grade-weight-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={newGradeWeightInput}
                                    onChange={(event) =>
                                        setNewGradeWeightInput(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Bijv. 2"
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Nieuw gemiddelde
                            </p>
                            <p className="mt-1 text-4xl font-black text-primary">
                                {newAverage !== null
                                    ? formatNumber(newAverage)
                                    : "—"}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {canCalculateNewAverage
                                    ? `Gebaseerd op ${currentWeight} bestaande cijfers en een nieuw cijfer met gewicht ${parsedNewGradeWeight}.`
                                    : "Vul een geldig cijfer en gewicht in om je nieuwe gemiddelde te berekenen."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card size="sm" className="border-border/60 bg-[#19191c]">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-xl font-bold">
                            Welk cijfer heb je nodig?
                        </CardTitle>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Vul je doel en het gewicht van het volgende cijfer
                            in.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="target-average-input"
                                    className="text-xs uppercase tracking-wide text-muted-foreground"
                                >
                                    Gewenst gemiddelde
                                </Label>
                                <Input
                                    id="target-average-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={targetAverageInput}
                                    onChange={(event) =>
                                        setTargetAverageInput(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Bijv. 7,5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="next-weight-input"
                                    className="text-xs uppercase tracking-wide text-muted-foreground"
                                >
                                    Gewicht van het volgende cijfer
                                </Label>
                                <Input
                                    id="next-weight-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={nextWeightInput}
                                    onChange={(event) =>
                                        setNextWeightInput(event.target.value)
                                    }
                                    placeholder="Bijv. 2"
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Nodig cijfer
                            </p>
                            <p className="mt-1 text-4xl font-black text-primary">
                                {requiredGrade !== null
                                    ? formatNumber(requiredGrade)
                                    : "—"}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {canCalculateRequiredGrade
                                    ? requiredGradeOutOfRange
                                        ? "Dit cijfer valt buiten de gebruikelijke schaal van 1 tot 10."
                                        : requiredGrade !== null
                                          ? `Je hebt met dit gewicht een cijfer van ${formatNumber(requiredGrade)} nodig.`
                                          : "Vul een gewenst gemiddelde en gewicht in om te zien welk cijfer je nodig hebt."
                                    : "Vul een gewenst gemiddelde en gewicht in om te zien welk cijfer je nodig hebt."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    LogIn,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Cyfers - Start",
};

export default async function LandingPage() {
    const cookieStore = await cookies();
    const hasActiveSession = Boolean(cookieStore.get("access_token"));

    const primaryHref = hasActiveSession ? "/home" : "/sign-in";
    const primaryLabel = hasActiveSession ? "Naar dashboard" : "Inloggen";
    const secondaryHref = hasActiveSession ? "/sign-in" : "/home";
    const secondaryLabel = hasActiveSession
        ? "Ander account"
        : "Naar dashboard";

    return (
        <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.15),transparent_32%)]" />
            <div className="absolute left-10 top-16 -z-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-12 right-8 -z-10 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
                <Card className="w-full border-border/60 bg-card/85 shadow-2xl shadow-primary/5 backdrop-blur">
                    <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                            <h1 className="text-5xl mb-6 font-black italic tracking-tighter text-primary">
                                Cyfers
                            </h1>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Studentenportaal
                            </div>

                            <div className="max-w-2xl space-y-6">
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                        Alles voor school, op een plek.
                                    </h1>
                                    <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                                        Bekijk snel je cijfers, rooster en
                                        verzuim. Nieuwe gebruikers loggen direct
                                        in. Bestaande gebruikers gaan meteen
                                        door naar hun dashboard.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="gap-2 px-6"
                                    >
                                        <Link href={primaryHref}>
                                            {primaryLabel}
                                            {hasActiveSession ? (
                                                <ArrowRight className="h-4 w-4" />
                                            ) : (
                                                <LogIn className="h-4 w-4" />
                                            )}
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="gap-2 px-6"
                                    >
                                        <Link href={secondaryHref}>
                                            {secondaryLabel}
                                        </Link>
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        Veilig inloggen met schoolaccount
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1">
                                        <CalendarDays className="h-4 w-4 text-sky-500" />
                                        Rooster en planning direct beschikbaar
                                    </span>
                                </div>

                                <p className="text-sm font-medium text-muted-foreground">
                                    {hasActiveSession
                                        ? "Je sessie is actief. Je kunt direct verder in het dashboard."
                                        : "Nog geen account? Log in om je persoonlijke dashboard te openen."}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-border/60 bg-muted/35 px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Snel naar wat je nodig hebt
                                    </h2>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        Na inloggen vind je hier direct je
                                        dagelijkse schoolinformatie.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            title: "Cijfers",
                                            description:
                                                "Bekijk behaalde resultaten en voortgang.",
                                        },
                                        {
                                            title: "Rooster",
                                            description:
                                                "Zie vandaag en deze week in een oogopslag.",
                                        },
                                        {
                                            title: "Verzuim",
                                            description:
                                                "Controleer je aanwezigheid en meldingen.",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-xl border border-border/70 bg-background/90 p-4 shadow-sm"
                                        >
                                            <div className="text-sm font-semibold text-foreground">
                                                {item.title}
                                            </div>
                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

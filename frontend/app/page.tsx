import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    CalendarRange,
    CheckCircle2,
    Clock3,
    GraduationCap,
    LayoutDashboard,
    LogIn,
    ShieldCheck,
    Sparkles,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Cyfers - Start",
    description:
        "Cyfers geeft leerlingen direct inzicht in cijfers, rooster en studievoortgang op een overzichtelijk dashboard.",
};

const valuePoints = [
    "Realtime inzicht in cijfers en voortgang per vak.",
    "Vandaag- en weekrooster zonder extra klikken.",
    "Verzuim en planning in hetzelfde overzicht.",
    "Veilig inloggen met je schoolaccount.",
];

const trustStats = [
    {
        value: "1 dashboard",
        label: "alles voor je schooldag op een plek",
    },
    {
        value: "24/7 inzicht",
        label: "altijd toegang tot actuele informatie",
    },
    {
        value: "3 kernmodules",
        label: "cijfers, rooster en aanwezigheid",
    },
    {
        value: "0 gedoe",
        label: "direct door na het inloggen",
    },
];

const featureCards = [
    {
        title: "Cijfers met context",
        description:
            "Zie niet alleen je laatste cijfer, maar ook je voortgang per vak zodat je sneller kunt bijsturen.",
        icon: BarChart3,
    },
    {
        title: "Rooster dat meebeweegt",
        description:
            "Bekijk vandaag en deze week in een oogopslag en weet meteen waar je moet zijn.",
        icon: CalendarRange,
    },
    {
        title: "Slim dagoverzicht",
        description:
            "Open je dashboard en je weet direct wat prioriteit heeft, zonder te zoeken in meerdere systemen.",
        icon: LayoutDashboard,
    },
];

const onboardingSteps = [
    {
        title: "Log in met je schoolaccount",
        description:
            "Meld je veilig aan en ga direct naar je persoonlijke omgeving.",
        icon: ShieldCheck,
    },
    {
        title: "Bekijk je dag in 10 seconden",
        description:
            "Check cijfers, rooster en aanwezigheid zodra je binnen bent.",
        icon: Clock3,
    },
    {
        title: "Werk slimmer richting resultaat",
        description:
            "Gebruik de inzichten om eerder actie te nemen en verrassingen te voorkomen.",
        icon: GraduationCap,
    },
];

const audienceCards = [
    {
        title: "Voor leerlingen",
        description:
            "Minder stress rondom cijfers en planning, meer focus op wat je vandaag moet doen.",
        icon: GraduationCap,
    },
    {
        title: "Voor mentoren en begeleiders",
        description:
            "Sneller signalen zien in voortgang en aanwezigheid, zodat begeleiding eerder start.",
        icon: Users,
    },
];

const faqItems = [
    {
        question: "Moet ik handmatig gegevens invullen?",
        answer: "Nee. Na inloggen worden je relevante schoolgegevens direct in het dashboard getoond.",
    },
    {
        question: "Werkt Cyfers ook op mobiel?",
        answer: "Ja. De interface schaalt mee voor telefoon, tablet en desktop, zodat je altijd snel kunt checken wat belangrijk is.",
    },
    {
        question: "Wat gebeurt er als mijn sessie verloopt?",
        answer: "Je wordt veilig uitgelogd en krijgt een duidelijke melding om opnieuw in te loggen.",
    },
    {
        question: "Waarom zou ik dagelijks Cyfers gebruiken?",
        answer: "Omdat je met een kort dagelijks moment sneller ziet waar je moet bijsturen in cijfers, planning en aanwezigheid.",
    },
];

export default async function LandingPage() {
    const cookieStore = await cookies();
    const hasActiveSession = Boolean(cookieStore.get("access_token"));

    const primaryHref = hasActiveSession ? "/home" : "/sign-in";
    const primaryLabel = hasActiveSession
        ? "Ga naar dashboard"
        : "Start met inloggen";
    const secondaryHref = hasActiveSession ? "/sign-in" : "#waarom-cyfers";
    const secondaryLabel = hasActiveSession
        ? "Gebruik ander account"
        : "Waarom Cyfers";

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.15),transparent_32%)]" />
            <div className="absolute -left-20 top-28 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                <header className="flex flex-wrap items-center justify-between gap-3 py-6 sm:py-8">
                    <div className="space-y-1">
                        <div className="text-4xl font-black italic tracking-tighter text-primary sm:text-5xl">
                            Cyfers
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Het studentenportaal dat elke schooldag
                            overzichtelijk maakt.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            asChild
                            variant="outline"
                            className="gap-2 px-4"
                        >
                            <Link href="/sign-in">Inloggen</Link>
                        </Button>
                        <Button asChild className="gap-2 px-4">
                            <Link href="/home">
                                Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </header>

                <section className="grid gap-8 pb-12 pt-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-10 lg:pb-16 lg:pt-8">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Slim overzicht voor cijfers, rooster en voortgang
                        </div>

                        <div className="space-y-5">
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Meer inzicht in je studie, zonder tijd te
                                verliezen.
                            </h1>
                            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                                Cyfers brengt je dagelijkse schoolinformatie
                                samen op een duidelijke plek. Je ziet in
                                seconden wat vandaag belangrijk is, waar je
                                voortgang goed gaat, en waar je moet bijsturen.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {valuePoints.map((point) => (
                                <div
                                    key={point}
                                    className="inline-flex items-start gap-2 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm text-muted-foreground"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg" className="gap-2 px-6">
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

                        <p className="text-sm font-medium text-muted-foreground">
                            {hasActiveSession
                                ? "Je sessie is actief. Open direct je dashboard en ga verder waar je gebleven was."
                                : "Nieuwe gebruiker? Log in en open meteen je persoonlijke dashboard."}
                        </p>
                    </div>

                    <Card className="border-border/60 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur">
                        <CardContent className="space-y-5 p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Wat je direct ziet
                                </h2>
                                <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                                    Vandaag
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <CalendarDays className="h-4 w-4 text-sky-400" />
                                        Rooster
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Eerste les om 08:30, lokaal B2.12.
                                        Tussenuren en wijzigingen direct
                                        zichtbaar.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <BarChart3 className="h-4 w-4 text-violet-300" />
                                        Cijfers
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Zie meteen welke vakken stijgen en waar
                                        extra aandacht nodig is.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                        Aanwezigheid
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Houd verzuim en meldingen centraal bij,
                                        zodat je op tijd kunt reageren.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 border-y border-border/60 py-8 sm:grid-cols-2 lg:grid-cols-4">
                    {trustStats.map((item) => (
                        <div
                            key={item.value}
                            className="rounded-xl border border-border/50 bg-card/70 px-4 py-5"
                        >
                            <p className="text-xl font-black tracking-tight text-foreground">
                                {item.value}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </section>

                <section id="waarom-cyfers" className="py-14 sm:py-16">
                    <div className="max-w-3xl space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                            Waarom leerlingen voor Cyfers kiezen
                        </h2>
                        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                            Het verschil zit in duidelijkheid: je hoeft niet
                            meer te zoeken, vergelijken of gissen. Cyfers laat
                            direct zien wat belangrijk is voor je volgende stap.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {featureCards.map((feature) => (
                            <Card
                                key={feature.title}
                                className="border-border/60 bg-card/80"
                            >
                                <CardContent className="space-y-3 p-5">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="py-6 sm:py-10">
                    <Card className="border-border/60 bg-muted/35">
                        <CardContent className="p-6 sm:p-8">
                            <div className="max-w-3xl space-y-3">
                                <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                                    Zo werkt starten met Cyfers
                                </h2>
                                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                                    Binnen enkele momenten heb je overzicht over
                                    je schoolweek.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {onboardingSteps.map((step) => (
                                    <div
                                        key={step.title}
                                        className="rounded-xl border border-border/60 bg-background/80 p-4"
                                    >
                                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <step.icon className="h-4 w-4 text-primary" />
                                            {step.title}
                                        </div>

                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="py-14 sm:py-16">
                    <div className="max-w-3xl space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                            Gebouwd voor dagelijkse schoolpraktijk
                        </h2>
                        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                            Of je nu leerling bent of begeleider: je wil sneller
                            zien wat aandacht nodig heeft.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {audienceCards.map((card) => (
                            <Card
                                key={card.title}
                                className="border-border/60 bg-card/75"
                            >
                                <CardContent className="space-y-3 p-5">
                                    <card.icon className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {card.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="py-6 sm:py-10">
                    <Card className="border-border/60 bg-card/80">
                        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground">
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                    Achter het project
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                                    Ontwikkeld door twee leerlingen uit 2 havo van het Lorentz Lyceum
                                </h2>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Cyfers is gebouwd door twee leerlingen die
                                    zelf merkten hoe verspreid schoolinformatie
                                    kan voelen. We wilden cijfers, rooster en
                                    aanwezigheid samenbrengen in een portaal dat
                                    sneller werkt, rustiger aanvoelt en echt helpt
                                    op een drukke schooldag.
                                </p>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Omdat we het systeem zelf vanuit de
                                    leerlingkant hebben opgebouwd, ligt de focus
                                    op overzicht, snelheid en eenvoud in plaats
                                    van overbodige functies.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <h3 className="text-base font-semibold text-foreground">
                                        Gebouwd vanuit ervaring
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        We gebruiken zelf een schoolomgeving en
                                        weten dus welke informatie snel vindbaar
                                        moet zijn.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <h3 className="text-base font-semibold text-foreground">
                                        Gemaakt voor leerlingen
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Elke keuze in Cyfers is gericht op
                                        duidelijkheid, zodat je minder hoeft te
                                        zoeken en sneller verder kunt.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border/60 bg-background/80 p-4 sm:col-span-2">
                                    <h3 className="text-base font-semibold text-foreground">
                                        Wat dat oplevert
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Een portaal dat niet alleen laat zien wat
                                        er gebeurt, maar ook waarom dat voor jou
                                        belangrijk is.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="py-10 sm:py-14">
                    <div className="max-w-3xl space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                            Veelgestelde vragen
                        </h2>
                        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                            Korte antwoorden op de belangrijkste vragen van
                            nieuwe gebruikers.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {faqItems.map((item) => (
                            <Card
                                key={item.question}
                                className="border-border/60 bg-card/80"
                            >
                                <CardContent className="space-y-2 p-5">
                                    <h3 className="text-base font-semibold text-foreground">
                                        {item.question}
                                    </h3>
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {item.answer}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="pb-6 pt-12 sm:pb-8 sm:pt-16">
                    <Card className="border-primary/40 bg-primary/10 shadow-xl shadow-primary/10">
                        <CardContent className="flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                                    Klaar voor meer rust in je schoolweek?
                                </h2>
                                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                                    Open je dashboard en maak van losse
                                    schoolinformatie een helder dagelijks plan.
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
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}

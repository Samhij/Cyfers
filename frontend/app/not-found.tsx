"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a", "Enter"
];

export default function NotFound() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [konamiActive, setKonamiActive] = useState(false);
    const progressRef = useRef(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === KONAMI_CODE[progressRef.current]) {
                progressRef.current += 1;
                if (progressRef.current === KONAMI_CODE.length) {
                    progressRef.current = 0;
                    setKonamiActive(k => !k);
                }
            } else {
                progressRef.current = e.key === KONAMI_CODE[0] ? 1 : 0;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="fixed inset-0 bg-background text-foreground flex items-center justify-center px-10">
            <div
                className="max-w-lg w-full space-y-6"
                style={mounted && konamiActive ? { animation: "spin-full 1s linear infinite" } : undefined}
            >
                <p className="text-8xl font-black text-primary">404</p>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black">Pagina niet gevonden</h1>
                    <p className="text-muted-foreground text-lg">
                        De pagina die je zoekt bestaat niet of is verplaatst.
                    </p>
                </div>
                <div className="h-px bg-border w-full" />
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/home")}
                        className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Ga naar home
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-secondary text-secondary-foreground font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Ga terug
                    </button>
                </div>
            </div>
        </div>
    );
}

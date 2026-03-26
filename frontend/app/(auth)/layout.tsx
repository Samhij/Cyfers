import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cyfers",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
            <div className="mb-10 text-center space-y-4">
                <h1 className="text-5xl font-black italic tracking-tighter text-primary">
                    Cyfers
                </h1>
                <p className="font-medium text-muted-foreground">
                    Studenten Portaal
                </p>
            </div>

            <div className="flex w-full justify-center">{children}</div>

            <p className="mt-8 text-sm text-muted-foreground">
                &copy; Cyfers 2026. Alle rechten voorbehouden.
            </p>
        </div>
    );
}
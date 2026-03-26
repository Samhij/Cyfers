import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cyfers - Sessie verlopen",
};

export default function SessionExpiredPage() {
    return (
        <Card className="w-full max-w-md bg-card px-6 py-10 bg-linear-to-tr from-background to-card">
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="size-6" />
                    <CardTitle className="text-2xl font-bold">
                        Je sessie is verlopen
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <Alert
                    variant="destructive"
                    className="border-2 border-destructive"
                >
                    <AlertCircle />
                    <AlertTitle className="font-bold">
                        Opnieuw inloggen vereist
                    </AlertTitle>
                    <AlertDescription>
                        Je bent uitgelogd omdat je sessie is verlopen. Log
                        opnieuw in om verder te gaan.
                    </AlertDescription>
                </Alert>

                <Button asChild className="w-full py-6 font-bold">
                    <Link href="/sign-in">
                        <LogIn className="size-4" />
                        Naar inloggen
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileQuestionMark, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [tenantUuid, setTenantUuid] = useState<string>("");
    const [selectedName, setSelectedName] = useState<string>("");

    const [schools, setSchools] = useState<{ naam: string; uuid: string }[]>(
        [],
    );

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        fetchSchools();
    }, []);

    useEffect(() => {
        console.log(tenantUuid);
    }, [tenantUuid]);

    async function fetchSchools() {
        try {
            const res = await fetch("/api/schools", {
                method: "GET",
            });

            if (!res.ok) {
                console.error("Failed to fetch schools:", res.status);
                return;
            }

            const data = await res.json();
            const orgs = data.organisations || [];
            setSchools(orgs);
        } catch (error) {
            console.error("Error fetching schools:", error);
            return;
        }
    }

    async function handleSignIn(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        console.log("Attempting sign-in for:", {
            username,
            tenantUuid,
            password: password ? "********" : "empty",
        });

        try {
            const res = await fetch("/api/auth/get-tokens/uname-pword", {
                method: "POST",
                credentials: "include",
                body: new URLSearchParams({
                    username: username,
                    password: password,
                    tenant_uuid: tenantUuid,
                }),
            });

            if (!res.ok) {
                console.error("Sign in failed:", res.status);
                setLoading(false);
                setError(res.statusText);
                return;
            }

            console.log("Sign in successful!");
            setLoading(false);
            router.push("/");
        } catch (error) {
            console.error("Sign in error:", error);
            setLoading(false);
            setError("Unknown error");
            return;
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-10 px-4 py-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black italic tracking-tighter text-primary">
                    Cyfers
                </h1>
                <p className="font-medium text-muted-foreground">
                    Studenten Portaal
                </p>
            </div>

            <Card className="w-full max-w-md bg-card px-6 py-10 bg-linear-to-tr from-background to-card">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Welkom terug
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Login met je schoolaccount om je cijfers, rooster en
                        verzuim te zien.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert
                            variant="destructive"
                            className="border-2 border-destructive"
                        >
                            <AlertCircle />
                            <AlertTitle className="font-bold">
                                Er is iets misgegaan
                            </AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form className="space-y-6" onSubmit={handleSignIn}>
                        <FieldGroup>
                            <Field>
                                <Label
                                    className="text-gray-200 text-xs font-bold uppercase leading-4 tracking-widest"
                                    htmlFor="school"
                                >
                                    School
                                </Label>
                                <Combobox
                                    items={schools}
                                    value={tenantUuid}
                                    onValueChange={(val) => {
                                        setTenantUuid(val ?? "");
                                        const school = schools.find(
                                            (s) => s.uuid === val,
                                        );
                                        setSelectedName(school?.naam ?? "");
                                    }}
                                >
                                    <ComboboxInput
                                        placeholder="Kies je onderwijsinstelling"
                                        className="h-10"
                                        value={selectedName}
                                        onChange={(e) =>
                                            setSelectedName(
                                                e.currentTarget.value,
                                            )
                                        }
                                    />
                                    <ComboboxContent className="bg-background">
                                        <ComboboxEmpty>
                                            Geen scholen gevonden.
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem
                                                    key={item.naam}
                                                    value={item.uuid}
                                                    className="cursor-pointer py-2"
                                                >
                                                    {item.naam}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </Field>

                            <Field>
                                <Label
                                    className="text-gray-200 text-xs font-bold uppercase leading-4 tracking-widest"
                                    htmlFor="leerlingnummer"
                                >
                                    Leerlingnummer
                                </Label>
                                <Input
                                    type="text"
                                    id="leerlingnummer"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    value={username}
                                    placeholder="bv. 123456"
                                    className="h-10"
                                    required
                                />
                            </Field>

                            <Field>
                                <Label
                                    className="text-gray-200 text-xs font-bold uppercase leading-4 tracking-widest"
                                    htmlFor="password"
                                >
                                    Wachtwoord
                                </Label>
                                <Input
                                    type="password"
                                    id="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                    placeholder="• • • • • • • •"
                                    className="h-10"
                                    required
                                />
                            </Field>
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="w-full text-center py-6 font-bold"
                            disabled={loading}
                        >
                            {loading
                                ? "Even geduld..."
                                : "Inloggen met Somtoday"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="bg-blur flex justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="p-5">
                                <HelpCircle />
                                Mijn school gebruikt Magister
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Magister</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Helaas ondersteunen wij Magister (nog) niet.
                                    Cyfers is gebouwd om te werken met de
                                    Somtoday API.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="w-full">Sluiten</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

            <p className="text-sm text-muted-foreground">
                &copy; Cyfers 2026. Alle rechten voorbehouden.
            </p>
        </div>
    );
}

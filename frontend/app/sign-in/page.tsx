"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [tenantUuid, setTenantUuid] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const [accessToken, setAccessToken] = useState<string | null>(null);

    const router = useRouter();

    async function signIn(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        const res = await fetch(
            "http://localhost:5000/get-tokens/uname-pword",
            {
                method: "POST",
                credentials: "include", // important — tells the browser to store the cookie
                body: new URLSearchParams({
                    username: username,
                    password: password,
                    tenant_uuid: tenantUuid,
                }),
            },
        );

        if (!res.ok) {
            console.error("Sign in failed:", res.status);
            return;
        }

        setLoading(false);
        router.push("/dashboard");
    }

    return (
        <div
            className="flex flex-col
                    <p>Token: {accessToken}</p> flex-1 items-center justify-center"
        >
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Choose your school and enter your leerlingnummer and
                        password to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="tenantuuid">Tenant UUID</Label>
                                <Input
                                    id="tenantuuid"
                                    type="text"
                                    onChange={(e) =>
                                        setTenantUuid(e.target.value)
                                    }
                                    value={tenantUuid}
                                    required
                                />
                            </Field>

                            <Field>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    value={username}
                                    required
                                />
                            </Field>

                            <Field>
                                <Label htmlFor="username">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                    required
                                />
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={signIn} disabled={loading}>
                        {loading ? "Signing in...." : "Sign in"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

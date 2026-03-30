import { cookies } from "next/headers";
import { Metadata } from "next";

import { SessionExpiredForm } from "./session-expired-form";

export const metadata: Metadata = {
    title: "Cyfers - Sessie verlopen",
};

export default async function SessionExpiredPage() {
    const cookieStore = await cookies();

    return (
        <SessionExpiredForm
            initialUsername={cookieStore.get("last_username")?.value ?? ""}
            initialTenantUuid={cookieStore.get("tenant_uuid")?.value ?? ""}
        />
    );
}
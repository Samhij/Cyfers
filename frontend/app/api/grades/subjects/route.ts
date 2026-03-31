import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("Cookie") || "";

        const response = await fetch(`${getBackendUrl()}/grades/subjects`, {
            method: "GET",
            headers: {
                Cookie: cookie,
            },
            next: { revalidate: 300 },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error in GET /api/grades/subjects:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
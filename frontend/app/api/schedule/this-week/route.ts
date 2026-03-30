import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("Cookie") || "";
        const { searchParams } = new URL(request.url);
        const week = searchParams.get("week");

        const backendUrl = new URL(`${getBackendUrl()}/schedule/week`);
        if (week) {
            backendUrl.searchParams.set("week", week);
        }

        const response = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: {
                "Cookie": cookie,
            },
            next: { revalidate: 300 },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error in GET /api/schedule/this-week:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const BACKEND_URL = "http://backend:5000";

async function fetchScheduleWeek(cookie: string, week: string | null) {
    const backendUrl = new URL(`${BACKEND_URL}/schedule/week`);
    if (week) {
        backendUrl.searchParams.set("week", week);
    }

    const response = await fetch(backendUrl.toString(), {
        method: "GET",
        headers: {
            "Cookie": cookie,
        },
    });

    const data = await response.json();
    return { data, status: response.status };
}

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("Cookie") || "";
        const { searchParams } = new URL(request.url);
        const week = searchParams.get("week");

        // Cache per user and per week (keyed by cookie + week param), for 5 minutes
        const getCached = unstable_cache(
            () => fetchScheduleWeek(cookie, week),
            [cookie, week ?? "current"],
            { revalidate: 300, tags: ["schedule-week"] }
        );

        const { data, status } = await getCached();
        return NextResponse.json(data, { status });
    } catch (error) {
        console.error("Error in GET /api/schedule/this-week:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

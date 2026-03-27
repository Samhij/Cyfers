import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const BACKEND_URL = "http://backend:5000";

async function fetchScheduleToday(cookie: string) {
    const response = await fetch(`${BACKEND_URL}/schedule/today`, {
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

        // Cache per user (keyed by their cookie), for 5 minutes
        const getCached = unstable_cache(
            () => fetchScheduleToday(cookie),
            [cookie],
            { revalidate: 300, tags: ["schedule-today"] }
        );

        const { data, status } = await getCached();
        return NextResponse.json(data, { status });
    } catch (error) {
        console.error("Error in GET /api/schedule/today:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

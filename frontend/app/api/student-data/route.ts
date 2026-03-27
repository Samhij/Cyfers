import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const BACKEND_URL = "http://backend:5000";

async function fetchStudentData(cookie: string) {
    const response = await fetch(`${BACKEND_URL}/student-data`, {
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

        // Cache per user (keyed by their cookie), for 1 hour
        const getCached = unstable_cache(
            () => fetchStudentData(cookie),
            [cookie],
            { revalidate: 3600, tags: ["student-data"] }
        );

        const { data, status } = await getCached();
        return NextResponse.json(data, { status });
    } catch (error) {
        console.error("Error in GET /api/student-data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("Cookie") || "";

        const response = await fetch(`${getBackendUrl()}/student-data`, {
            method: "GET",
            headers: {
                "Cookie": cookie,
            },
            next: { revalidate: 3600 },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error in GET /api/student-data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

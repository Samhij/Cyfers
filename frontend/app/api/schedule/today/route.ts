import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://backend:5000";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/schedule/today`, {
            method: "GET",
            headers: {
                "Cookie": request.headers.get("Cookie") || "",
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error in GET /api/schedule/today:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

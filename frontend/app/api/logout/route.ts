import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://backend:5000";

export async function POST(request: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            headers: {
                "Cookie": request.headers.get("Cookie") || "",
            },
        });

        const data = await response.json();
        const res = NextResponse.json(data, { status: response.status });

        // Forward all set-cookie headers correctly
        const setCookies = response.headers.getSetCookie();
        if (setCookies && setCookies.length > 0) {
            setCookies.forEach(cookie => {
                res.headers.append("set-cookie", cookie);
            });
        }

        return res;

    } catch (error) {
        console.error("Error in POST /api/logout:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

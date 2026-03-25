import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://backend:5000";

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const response = await fetch(`${BACKEND_URL}/auth/get-tokens/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": request.headers.get("Content-Type") || "application/x-www-form-urlencoded",
            },
            body: body,
        });

        const data = await response.json();
        const res = NextResponse.json(data, { status: response.status });

        // Forward set-cookie-headers
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
            res.headers.set("set-cookie", setCookie);
        }

        return res;
    } catch (error) {
        console.error("Error in POST /api/auth/get-tokens/refresh-token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
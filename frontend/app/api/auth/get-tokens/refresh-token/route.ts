import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const response = await fetch(`${getBackendUrl()}/auth/get-tokens/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": request.headers.get("Content-Type") || "application/x-www-form-urlencoded"
            },
            body: body,
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
        console.error("Error in POST /api/auth/get-tokens/refresh-token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
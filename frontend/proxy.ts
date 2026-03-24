import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("access_token");

    if (!accessToken) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"]
}
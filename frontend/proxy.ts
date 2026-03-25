import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/") {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
        return NextResponse.next();
    }

    if (pathname === "/sign-in" && accessToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/sign-in"],
};
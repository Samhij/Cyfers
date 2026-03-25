import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/home" || pathname === "/cijfers" || pathname === "/rooster" || pathname === "/verzuim") {
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
    matcher: ["/home", "/cijfers", "/rooster", "/verzuim", "/sign-in"],
};
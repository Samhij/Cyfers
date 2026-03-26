import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const lastUsername = request.cookies.get("last_username")?.value;
    const { pathname } = request.nextUrl;

    if (pathname === "/home" || pathname === "/cijfers" || pathname === "/rooster" || pathname === "/verzuim") {
        if (!accessToken) {
            const redirectPath = lastUsername ? "/session-expired" : "/sign-in";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        return NextResponse.next();
    }

    if (pathname === "/sign-in" && accessToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/session-expired" && accessToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home", "/cijfers", "/rooster", "/verzuim", "/sign-in", "/session-expired"],
};
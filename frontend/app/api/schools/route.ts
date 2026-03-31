import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${getBackendUrl()}/schools`);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error in GET /api/schools:", error);
        return NextResponse.json({ organisations: [] }, { status: 200 });
    }
}

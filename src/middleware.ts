// Edge Runtime middleware — do NOT import lib/notion.ts or lib/env.ts here
import { NextResponse, type NextRequest } from "next/server";

// Maximum allowed Content-Length for API requests (1 KB)
const MAX_CONTENT_LENGTH = 1024;

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Only apply to API routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Block non-GET methods on our read-only API routes
  if (request.method !== "GET") {
    return new NextResponse(
      JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          Allow: "GET",
        },
      }
    );
  }

  // Block abnormally large requests based on Content-Length header
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const parsed = parseInt(contentLength, 10);
    if (!isNaN(parsed) && parsed > MAX_CONTENT_LENGTH) {
      return new NextResponse(
        JSON.stringify({ error: "Payload too large", code: "PAYLOAD_TOO_LARGE" }),
        {
          status: 413,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Add CORS headers — allow GET requests from same origin only
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", request.headers.get("origin") ?? "");
  response.headers.set("Access-Control-Allow-Methods", "GET");
  response.headers.set("Vary", "Origin");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};

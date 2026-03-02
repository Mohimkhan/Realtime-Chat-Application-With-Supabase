import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  return await updateSession(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons (icons folder)
     * - images (images folder)
     * Feel free to add more paths that should be public.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

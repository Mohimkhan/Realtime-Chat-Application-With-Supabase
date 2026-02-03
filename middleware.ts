import { NextRequest } from "next/server";
import { updateSession } from "./lib/utils/supabase";

export async function middleware(req: NextRequest) {
  return await updateSession(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Skip middleware logic for static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Set custom x-pathname header so Server Components can read the pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 2. Fetch authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Define public-only and auth-only paths
  const isLoginPath = pathname === "/auth/login";
  const isCallbackPath = pathname.startsWith("/auth/callback");
  const isOnboardingPath = pathname.startsWith("/auth/onboarding");
  const isPublicPath = isLoginPath || isCallbackPath;

  // Allow public paths unconditionally
  if (isPublicPath) {
    // If already logged in and going to login, redirect to root
    if (isLoginPath && user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  // All other routes require authentication
  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/auth/login?error=Debes+iniciar+sesión+para+acceder.",
        request.url,
      ),
    );
  }

  // Check onboarding status for authenticated users
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const { count: commerceCount } = await supabase
    .from("commerces")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const hasCompletedOnboarding =
    !!profile?.username && (commerceCount || 0) > 0;

  // If accessing onboarding but already completed it, redirect to root
  if (isOnboardingPath && hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If accessing non-onboarding routes but hasn't completed onboarding
  if (!isOnboardingPath && !hasCompletedOnboarding) {
    return NextResponse.redirect(new URL("/auth/onboarding", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

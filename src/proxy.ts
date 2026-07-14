import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Skip middleware logic for static assets and public landing pages
  if (
    pathname === "/" ||
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

  // 3. Validation routing rules
  const isOnboardingPath = pathname.startsWith("/auth/onboarding");
  const isPanelPath = pathname.startsWith("/panel");
  const isLoginPath = pathname === "/auth/login";

  if (isLoginPath) {
    if (user) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
    return response;
  }

  if (isPanelPath || isOnboardingPath) {
    if (!user) {
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=Debes+iniciar+sesión+para+acceder.",
          request.url,
        ),
      );
    }

    // Query onboarding status from DB
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

    if (isPanelPath && !hasCompletedOnboarding) {
      return NextResponse.redirect(new URL("/auth/onboarding", request.url));
    }

    if (isOnboardingPath && hasCompletedOnboarding) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

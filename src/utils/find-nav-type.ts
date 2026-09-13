export type NavType = "main" | "marketing" | "minimal";

export function getNavType(pathname: string, authenticated: boolean): NavType {
  if (["/signin", "/signup", "/onboarding"].includes(pathname)) {
    return "minimal";
  }

  if (pathname === "/" || pathname.startsWith("/digest/")) {
    return authenticated ? "main" : "marketing";
  }

  return "main";
}

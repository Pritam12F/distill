import { NavbarType } from "@/components/navbar";

export function findNavType(
  pathName: string,
  authenticated: boolean,
): NavbarType {
  console.log(pathName);
  if (pathName === "/") {
    if (authenticated) {
      return {
        type: "main",
      };
    }
    return {
      type: "marketing",
    };
  } else if (["/signin", "/signup"].includes(pathName)) {
    return {
      type: "minimal",
    };
  } else if (pathName === "/onboarding") {
    return {
      type: "minimal",
    };
  } else if (pathName.startsWith("/digest")) {
    if (authenticated) {
      return {
        type: "main",
      };
    }

    return {
      type: "marketing",
    };
  } else {
    return {
      type: "main",
    };
  }
}

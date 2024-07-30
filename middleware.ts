import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // if (isApiAuthRoute) return null;
  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // return null;
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // return null
  // return;
});

// export async function middleware(req: Request) {
//   const url = new URL(req.url);
//   const session = await getServerSession(req, authConfig);

//   const isLoggedIn = !!session;

//   const isApiAuthRoute = url.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(url.pathname);
//   const isAuthRoute = authRoutes.includes(url.pathname);

//   if (isApiAuthRoute) return NextResponse.next();

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url));
//     }
//     return NextResponse.next();
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     let callbackUrl = url.pathname;

//     if (url.search) {
//       callbackUrl += url.search;
//     }

//     const encodedCallbackUrl = encodeURIComponent(callbackUrl);

//     return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, url));
//   }

//   return NextResponse.next();
// }

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

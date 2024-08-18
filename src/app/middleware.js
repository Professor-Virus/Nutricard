import { clerkMiddleware } from "@clerk/nextjs";
 
export default clerkMiddleware({
  publicRoutes: ["/", "/(.*)", "/api/check-subscription"]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
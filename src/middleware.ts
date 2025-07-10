export { default } from "next-auth/middleware"

export const config = { 
    matcher: [
        "/admin/:path*", 
        "/coach/:path*", 
        "/client/:path*", 
        "/clinic/:path*",
        "/api/activity/:path*",
        "/api/admin/:path*",
        "/api/client/:path*",
        "/api/clinic/:path*",
        "/api/coach/:path*",
        "/api/message/:path*",
        "/api/user/:path*"
    ]
}
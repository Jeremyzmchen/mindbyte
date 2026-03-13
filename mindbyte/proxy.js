import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
    // 需要拦截的路径
    matcher: [
        // "/dashboard/user/:path*",
        // "/dashboard/admin/:path*",
        // "/api/user/:path*",
        // "/api/admin/:path*",
    ],
};

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl.pathname;
        const userRole = req.nextauth?.token?.user?.role;

        // admin 路径：只有 admin 角色才能访问
        if (url.includes("/admin") && userRole !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // user 路径：admin 和 user 都可以访问，不进行拦截
        // 如果是未登录，在回调函数中处理
    },
    {
        callbacks: {
            // 统一登录验证：没有 token 就拒绝，withAuth内部执行跳转
            authorized: ({ token }) => !!token
        },
    }
);
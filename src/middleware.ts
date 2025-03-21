import { NextRequest, NextResponse } from "next/server";


export default function middleware(req:NextRequest) {
    const token = req.cookies.get('@nextauth.token')?.value;
   // const protectRoutes = ['/admcontrato']
    if(req.nextUrl.pathname !== '/' && !token) {
        return NextResponse.redirect(new URL('/', req.url))
    }
}

export const config = {
matcher: ['/dashboard/:path*'],
}
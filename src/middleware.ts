import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const token = req.cookies.get('@nextauth.token')?.value;



    if (req.nextUrl.pathname !== '/' && !await isValidate(token)) {
        return NextResponse.redirect(new URL('/', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};

const isValidate = async (token: string | undefined) => {
    if (!token) {
        return false;
    }

    try {
        console.log('Validating token:', token);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

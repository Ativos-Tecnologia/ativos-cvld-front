import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const hostWithPort = req.headers.get('host') || '';
    const host = hostWithPort.split(':')[0];

    let tenant: string = '';

    if (host === 'localhost') {
        tenant = 'celer';
    }

    if (host.endsWith('localhost')) {
        const parts = host.split('.');
        if (parts.length === 2 && parts[0] !== 'localhost') {
            tenant = parts[0];
        }
    } else {
        const parts = host.split('.');
        if (parts.length > 2) {
            tenant = parts[0];
        }
    }

    req.headers.set('x-tenant', tenant);
    const url = req.nextUrl.clone();
    url.searchParams.set('host', tenant);

    NextResponse.rewrite(url);

    const response = NextResponse.next();
    response.headers.set('x-tenant', tenant);

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image).*)'],
};

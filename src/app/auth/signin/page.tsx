import { headers } from 'next/headers';
import SignInClient from './SignInClient';

export default function SignInPage() {
    const reqHeaders = headers();
    const tenant = reqHeaders.get('x-tenant') || 'celer';

    return <SignInClient host={tenant} />;
}

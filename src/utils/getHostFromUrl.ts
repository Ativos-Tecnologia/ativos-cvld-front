export function getTenantFromUrl(): string {
    if (typeof window === 'undefined') return 'celer';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[0] : 'celer';
}

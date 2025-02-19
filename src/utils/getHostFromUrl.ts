export function getTenantFromUrl(): string {
    // if (typeof window === 'undefined') return 'default';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    console.log(parts);
    return parts.length > 1 ? parts[0] : 'default';
}

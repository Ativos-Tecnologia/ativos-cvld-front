function useClearInvalidTokens() {
    if (typeof window !== 'undefined') {
        const localAccess = localStorage.getItem('ATIVOS_access');
        const localRefresh = localStorage.getItem('ATIVOS_refresh');

        if (localAccess === 'undefined' || localRefresh === 'undefined') {
            localStorage.removeItem('ATIVOS_access');
            localStorage.removeItem('ATIVOS_refresh');
        }
    }
}

export default useClearInvalidTokens;
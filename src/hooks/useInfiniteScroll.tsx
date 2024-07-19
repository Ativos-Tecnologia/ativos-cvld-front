import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/utils/api';

interface UseInfiniteScrollProps<T> {
    url: string;
    pageSize?: number;
}

interface ApiResponse<T> {
    results: T[];
    next: string | null;
}

const useInfiniteScroll = <T,>({ url, pageSize = 10 }: UseInfiniteScrollProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<ApiResponse<T>>(url, {
                params: { page, page_size: pageSize },
            });
            setItems(prevItems => [...prevItems, ...response.data.results]);
            setHasMore(response.data.next !== null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [url, page, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const lastItemRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return { items, lastItemRef, loading, error, hasMore };
};

export default useInfiniteScroll;

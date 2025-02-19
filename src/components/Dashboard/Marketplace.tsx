'use client';
import { NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { AiOutlineLoading } from 'react-icons/ai';
import { Button } from '../Button';
import Card from '../Cards/marketplaceCard';
import MarketplaceCardSkeleton from '../Skeletons/MarketplaceCardSkeleton';
import GridCardsWrapper from '../CrmUi/Wrappers/GridCardsWrapper';

const Marketplace: React.FC = () => {
    const { push } = useRouter();

    const [marketPlaceItems, setMarketPlaceItems] = useState<NotionResponse>({
        object: 'list',
        next_cursor: null,
        has_more: false,
        results: [],
    });
    // const [backendResults, setBackendResults] = useState<NotionPage[]>([]);
    const [firstLoad, setFirstLoad] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [userApprovation, setUserApprovation] = useState<boolean | null>(null);

    function handleRedirect(id: string) {
        push(`/dashboard/marketplace/${id}`);
    }

    const fetchMarketplaceList = async () => {
        const response = await api.post('api/notion-api/marketplace/available/');
        return response.data;
    };

    const { data, isFetching } = useQuery<NotionResponse>({
        queryKey: ['notion_marketplace_list'],
        refetchOnReconnect: true,
        refetchInterval: 60000,
        queryFn: fetchMarketplaceList,
        initialData: marketPlaceItems,
    });

    const updatedData = useMemo(() => {
        let customResults = {
            next_cursor: marketPlaceItems.next_cursor,
            has_more: marketPlaceItems.has_more,
            results: [...(data?.results || []), ...(marketPlaceItems.results || [])],
        };

        return customResults;
    }, [data?.next_cursor, data?.has_more, data?.results, marketPlaceItems]);

    async function loadMore() {
        setLoading(true);
        const response = await api.post('api/notion-api/marketplace/available/', {
            next_cursor: data?.next_cursor || null,
        });

        if (response.status === 200) {
            setMarketPlaceItems(response.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (data.results.length > 0) {
            setFirstLoad(false);
            setMarketPlaceItems((old) => {
                return {
                    ...old,
                    has_more: data.has_more,
                    next_cursor: data.next_cursor,
                };
            });
        }
    }, [data]);

    useEffect(() => {
        async function fetchUserApprovation() {
            try {
                const response = await api.get('/api/profile/');
                setUserApprovation(response.data.staff_approvation);
            } catch (e) {
                console.error(`Erro ao tentar verificar aprovação do usuário: ${e}`);
            }
        }

        fetchUserApprovation();
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <div className="md:px-3 xl:p-0">
                <Fade
                    className="font-semibold dark:text-snow 2xsm:mb-4 2xsm:text-3xl xsm:text-4xl md:mb-2"
                    cascade
                    damping={0.1}
                    triggerOnce
                >
                    Explore investimentos
                </Fade>
                <Fade delay={2200} damping={0.1} triggerOnce>
                    <p className="font-white 2xsm:text-sm lg:text-base">
                        Aproveite oportunidades exclusivas de ativos judiciais e maximize seus
                        retornos com segurança e credibilidade.
                    </p>
                </Fade>
            </div>

            <GridCardsWrapper>
                <GridCardsWrapper.List>
                    {isFetching && firstLoad ? (
                        <>
                            <Fade cascade damping={0.1} triggerOnce>
                                {[...Array(6)].map((_, index: number) => (
                                    <MarketplaceCardSkeleton key={index} />
                                ))}
                            </Fade>
                        </>
                    ) : (
                        <>
                            {updatedData.results.length > 0 ? (
                                <Fade cascade damping={0.1} triggerOnce>
                                    {updatedData!.results?.map((oficio) => (
                                        <Card
                                            key={oficio.id}
                                            oficio={oficio}
                                            onClickFn={() => handleRedirect(oficio.id)}
                                            disabled={userApprovation === false ? true : false}
                                        />
                                    ))}
                                </Fade>
                            ) : (
                                <div className="my-10 flex flex-col items-center justify-center gap-5 md:col-span-2 xl:col-span-3 3xl:col-span-4">
                                    <Image
                                        src="/images/empty_cart.svg"
                                        alt="homem com lista em mãos e carrinho vazio"
                                        width={280}
                                        height={280}
                                    />
                                    <p className="text-center font-medium tracking-wider">
                                        Ainda não temos opções de investimentos disponíveis.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </GridCardsWrapper.List>
            </GridCardsWrapper>

            {updatedData.has_more && updatedData.results.length > 0 && (
                <div className="flex w-full items-center justify-center">
                    <Button
                        onClick={loadMore}
                        variant="outlined"
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <AiOutlineLoading className="animate-spin" />
                                <span>Carregando...</span>
                            </>
                        ) : (
                            'Carregar mais'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Marketplace;

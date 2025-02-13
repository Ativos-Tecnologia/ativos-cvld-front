'use client';
import { BrokersContext } from '@/context/BrokersContext';
import { NotionPage } from '@/interfaces/INotion';
import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { IoIosArrowDown } from 'react-icons/io';
import DashbrokersCard from '../Cards/DashbrokersCard';
import BrokerComissionDistribution from '../Charts/BrokerComissionDistributionChart';
import BrokerQuantityDistributedChart from '../Charts/BrokerQuantityDistributedChart';
import GridCardsWrapper from '../CrmUi/Wrappers/GridCardsWrapper';
import CredorFilter from '../Filters/CredorFilter';
import { UserShadFilter } from '../Filters/userShadFilter';
import BrokerModal from '../Modals/BrokersCedente';
import DocForm from '../Modals/BrokersDocs';
import BrokerCardSkeleton from '../Skeletons/BrokerCardSkeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import Show from '../Show';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { bancos } from '@/constants/bancos';
import { BrokerQuantityDistribuitionChart } from '../Charts/BrokerQuantityDistribuitionChart';
import { BrokerComissionPreviewChart } from '../Charts/BrokerComissionPreviewChart';

/**
 * Componente que renderiza a lista de brokers
 * (wrapper principal)
 *
 * @returns {JSX.Element} - Componente renderizado
 */

const Broker: React.FC = (): JSX.Element => {
    const { cedenteModal, cardsData, docModalInfo } = useContext(BrokersContext);

    const {
        data: { role, sub_role },
    } = useContext(UserInfoAPIContext);

    const [visibleData, setVisibleData] = useState<NotionPage[]>([]);
    const observerRef = React.useRef<HTMLDivElement>(null);
    const isFirstLoad = React.useRef<boolean>(true);

    /**
     * função com useCallback para adicionar mais itens
     * ao array que renderiza os cards
     *
     * @returns {void}
     */
    const loadMoreItems = useCallback(() => {
        if (cardsData?.results) {
            if (visibleData.length < cardsData?.results.length) {
                const nextItems = cardsData.results.slice(
                    visibleData.length,
                    visibleData.length + 4,
                );
                setVisibleData((prevItems) => [...prevItems, ...nextItems]);
            }
        }
    }, [cardsData, visibleData]);

    /**
     * Atualiza a lista de cards ao entrar no range do observerRef
     */
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreItems();
            }
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loadMoreItems]);

    /**
     * Atualiza o estado de firstLoad e do visibleData.
     *
     * OBS:
     * (firstLoad deve ser true para a atualização funcionar,
     * desta forma evita que alguma atualização do cardsData
     * atualize o visibleData de forma indesejada).
     */
    useEffect(() => {
        if (isFirstLoad.current && cardsData) {
            setVisibleData(cardsData.results.slice(0, 2));
            isFirstLoad.current = false;
        } else {
            setVisibleData(cardsData?.results.slice(0, 2) || []);
        }
    }, [isFirstLoad.current, cardsData]);

    return (
        <div className="grid grid-cols-12">
            {/* tablet em diante */}
            <div className="item-center col-span-12 mb-5 flex flex-col gap-5 rounded-md bg-white p-5 dark:bg-boxdark 2xsm:hidden md:flex md:flex-row md:justify-between xl:justify-normal">
                {/* <UserFilterComponent /> */}
                <Show when={role === 'ativos' || sub_role === 'coordenador'}>
                    <UserShadFilter />
                </Show>
                <CredorFilter />
            </div>
            {/* Mobile */}
            <div className="col-span-12 mb-5 flex flex-col gap-5 rounded-md bg-white p-5 dark:bg-boxdark 2xsm:flex md:hidden md:flex-row md:justify-between xl:justify-normal">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            Filtros de Busca
                            <IoIosArrowDown />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-4">
                                <CredorFilter />
                                <UserShadFilter />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="col-span-12 mb-5 grid grid-cols-1 items-center gap-5 lg:grid-cols-12">
                <BrokerQuantityDistribuitionChart data={cardsData} />
                <BrokerComissionPreviewChart data={cardsData} />
                {/* <BrokerQuantityDistributedChart title="Distribuição" response={cardsData} /> */}
                {/* <BrokerComissionDistribution title="Previsão de Comissão" response={cardsData} /> */}
            </div>

            <GridCardsWrapper className="col-span-12">
                <GridCardsWrapper.List cardsSize="lg" className="my-0 mt-4 items-center gap-5">
                    {isFirstLoad.current ? (
                        <Fade cascade damping={0.1} triggerOnce>
                            {[...Array(4)].map((_, index: number) => (
                                <BrokerCardSkeleton key={index} />
                            ))}
                        </Fade>
                    ) : (
                        <>
                            {visibleData.length > 0 ? (
                                <Fade cascade damping={0.1} triggerOnce>
                                    {visibleData.map((oficio: any, index: number) => (
                                        <DashbrokersCard oficio={oficio} key={index} />
                                    ))}
                                </Fade>
                            ) : (
                                <div className="col-span-2 my-10 flex flex-col items-center justify-center gap-5">
                                    <Image
                                        src="/images/documents.svg"
                                        alt="documentos com botão de adicionar"
                                        width={210}
                                        height={210}
                                    />
                                    <p className="text-center font-medium tracking-wider">
                                        Sem registros de ofício para exibir.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </GridCardsWrapper.List>
            </GridCardsWrapper>

            <div ref={observerRef} className="col-span-12 h-5" />
            {cedenteModal !== null && <BrokerModal />}
            {docModalInfo !== null && <DocForm />}
        </div>
    );
};
export default Broker;

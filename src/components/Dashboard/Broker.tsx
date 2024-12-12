"use client";
import { BrokersContext } from "@/context/BrokersContext";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { NotionPage } from "@/interfaces/INotion";
import api from "@/utils/api";
import Image from "next/image";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import DashbrokersCard from "../Cards/DashbrokersCard";
import BrokerComissionDistribution from "../Charts/BrokerComissionDistributionChart";
import BrokerQuantityDistributedChart from "../Charts/BrokerQuantityDistributedChart";
import GridCardsWrapper from "../CrmUi/Wrappers/GridCardsWrapper";
import CredorFilter from "../Filters/CredorFilter";
import UsersFilter from "../Filters/UsersFilter";
import BrokerModal from "../Modals/BrokersCedente";
import DocForm from "../Modals/BrokersDocs";
import Show from "../Show";
import BrokerCardSkeleton from "../Skeletons/BrokerCardSkeleton";

/**
 * Componente que renderiza a lista de brokers
 * (wrapper principal)
 * 
 * @returns {JSX.Element} - Componente renderizado
 */

const Broker: React.FC = (): JSX.Element => {

  const {
    editModalId,
    setEditModalId,
    cedenteModal,
    cardsData,
    docModalInfo,
    setSelectedUser,
    selectedUser,
    loadingCardData,
  } = useContext(BrokersContext);


  const {
    data: { role, user }
  } = useContext(UserInfoAPIContext);


  const [openUsersPopover, setOpenUsersPopover] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<string[]>([]);
  const [filteredUsersList, setFilteredUsersList] = useState<string[]>([]);
  const [visibleData, setVisibleData] = useState<NotionPage[]>([]);
  const selectUserRef = React.useRef<HTMLDivElement>(null);
  const searchUserRef = React.useRef<HTMLInputElement>(null);
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
          visibleData.length + 4
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
      setVisibleData(cardsData?.results.slice(0, 2) || [])
    }
  }, [isFirstLoad.current, cardsData]);


  const userListAlreadyLoaded = useRef(false);

  /**
   * Carrega a lista de usuários para o filtro
   */
  useEffect(() => {
    const fetchData = async () => {

      if (userListAlreadyLoaded.current || !openUsersPopover) return;
      const [usersList] = await Promise.all([
        api.get("/api/notion-api/list/users/"),
      ]);

      if (usersList.status === 200) {
        setUsersList(usersList.data);
        setFilteredUsersList(usersList.data);
        userListAlreadyLoaded.current = true;
      }
    };

    fetchData();
  }, [openUsersPopover]);

  /**
   * Filtra a lista de usuários renderizada no popup
   * de acordo com o valor digitado no input de search
   * 
   * @param {string} value - valor do input de search
   * @returns {void} - retorno vazio
   */
  const searchUser = (value: string): void => {
    const filteredUsers = usersList.filter((user) =>
      user.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredUsersList(filteredUsers);
  };


  return (
    <>
      <div className="flex gap-5 item-center bg-white dark:bg-boxdark mb-5 p-5 rounded-md flex-col md:justify-between md:flex-row xl:justify-normal">
        <Show when={role === "ativos"}>
          <UsersFilter
            openUsersPopover={openUsersPopover}
            setOpenUsersPopover={setOpenUsersPopover}
            loadingCardData={loadingCardData}
            filteredUsersList={filteredUsersList}
            searchUser={searchUser}
          />
        </Show>
        <CredorFilter />
      </div>
      <div className="grid grid-cols-1  items-center gap-5  xl:grid-cols-12">
        <BrokerQuantityDistributedChart
          title="Distribuição"
          response={cardsData}
        />
        <BrokerComissionDistribution
          title="Previsão de Comissão"
          response={cardsData}
        />
      </div>

      <GridCardsWrapper>
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
                    <DashbrokersCard
                      oficio={oficio}
                      key={index}
                    />
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

      <div ref={observerRef} className="h-5" />
      {cedenteModal !== null && <BrokerModal />}
      {docModalInfo !== null && <DocForm />}
    </>
  );
};
export default Broker;

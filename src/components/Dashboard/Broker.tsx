"use client";
import DashbrokersCard from "../Cards/DashbrokersCard";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import BrokerCardSkeleton from "../Skeletons/BrokerCardSkeleton";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";
import { BrokersContext } from "@/context/BrokersContext";
import BrokerModal from "../Modals/BrokersCedente";
import DocForm from "../Modals/BrokersDocs";
import BrokerComissionDistribution from "../Charts/BrokerComissionDistributionChart";
import BrokerQuantityDistributedChart from "../Charts/BrokerQuantityDistributedChart";
import { LucideChevronsUpDown } from "lucide-react";
import { AiOutlineLoading, AiOutlineSearch } from "react-icons/ai";
import api from "@/utils/api";
import Show from "../Show";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { BiUser } from "react-icons/bi";
import { NotionPage, NotionResponse } from "@/interfaces/INotion";

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
    data: {role, user}
  }  = useContext(UserInfoAPIContext);
  

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
      console.log(userListAlreadyLoaded.current);
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
   * Foca no input de search quando o filtro de usuários
   * é aberto
   */
  useEffect(() => {
    if (openUsersPopover && searchUserRef.current) {
      searchUserRef.current.focus();
    }
  }, [openUsersPopover]);

  /**
   * Fecha o filtro de usuários sempre que é dado um clique
   * fora da sua área ou sempre que a tecla esc for pressionada
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectUserRef.current && !selectUserRef.current.contains(event.target as Node)) {
        setOpenUsersPopover(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenUsersPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      <React.Fragment>
        <Show when={role === "ativos"}>
        {/* ====== select de user merece um componente próprio ====== */}
        <div className="flex items-start gap-1 mb-4">
          <div className="relative">
            <label className="text-sm mb-2 font-semibold text-bodydark2 dark:text-bodydark flex">
              <BiUser className="w-5 h-5 mr-2" /> <p className="uppercase">Filtro por usuário</p>
            </label>
            <div className="flex items-center justify-center">
              <div
                onClick={() => {
                  setOpenUsersPopover(!openUsersPopover)
                }}
                className={`flex min-w-48 items-center justify-between gap-1 border border-stroke px-2 py-1 text-xs font-semibold uppercase hover:bg-slate-100 dark:border-strokedark dark:hover:bg-slate-700 ${openUsersPopover && "bg-slate-100 dark:bg-slate-700"} cursor-pointer rounded-md transition-colors duration-200`}
              >
                <span>{selectedUser || user}</span>
                <LucideChevronsUpDown className="h-4 w-4" />
              </div>
              {
                loadingCardData && <AiOutlineLoading className="ml-4 animate-spin" />
              }
            </div>
            {/* ==== popover ==== */}

            {openUsersPopover && (
              <div
                ref={selectUserRef}
                className={`absolute z-20 mt-3 w-[230px] rounded-md border border-stroke bg-white p-3 shadow-1 dark:border-strokedark dark:bg-form-strokedark ${openUsersPopover ? "visible opacity-100 animate-in fade-in-0 zoom-in-95" : " invisible opacity-0 animate-out fade-out-0 zoom-out-95"} transition-opacity duration-500`}
              >
                <div className="flex items-center justify-center gap-1 border-b border-stroke dark:border-bodydark2">
                  <AiOutlineSearch className="text-lg" />
                  <input
                    ref={searchUserRef}
                    type="text"
                    placeholder="Pesquisar usuário..."
                    className="w-full border-none bg-transparent focus-within:ring-0 dark:placeholder:text-bodydark2"
                    onKeyUp={(e) => searchUser(e.currentTarget.value)}
                  />
                </div>

                <div className="mt-3 flex max-h-49 flex-col gap-1 overflow-y-scroll overflow-x-hidden">
                  {filteredUsersList.length > 0 &&
                    filteredUsersList.map((user) => (
                      <p
                        key={user}
                        className="cursor-pointer rounded-sm p-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => {
                          setOpenUsersPopover(false);
                          setSelectedUser(user);
                        }}
                      >
                        {user}
                      </p>
                    ))}
                </div>
              </div>
            )}
            {/* ==== end popover ==== */}
          </div>
        </div>
        {/* ====== finaliza select de user ====== */}
        </Show>
      </React.Fragment>
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
      <div className="mt-4 grid w-full grid-cols-1 md:grid-cols-2 items-center gap-5">
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
      </div>
      <div ref={observerRef} className="h-5" />
      {cedenteModal !== null && <BrokerModal />}
      {docModalInfo !== null && <DocForm />}
    </>
  );
};
export default Broker;

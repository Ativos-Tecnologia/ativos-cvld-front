"use client";
import { NotionPage, NotionResponse } from "@/interfaces/INotion";
import api from "@/utils/api";
import React, { createContext, useEffect, useState } from "react";

export type BrokersContextProps = {
    editModalId: string | null;
    setEditModalId: React.Dispatch<React.SetStateAction<string | null>>;
    cedenteModal: NotionPage | null;
    setCedenteModal: React.Dispatch<React.SetStateAction<NotionPage | null>>;
    docModalInfo: NotionPage | null;
    setDocModalInfo: React.Dispatch<React.SetStateAction<NotionPage | null>>;
    cardsData: NotionResponse | null;
    loadingCardData: boolean;
    setCardsData: React.Dispatch<React.SetStateAction<NotionResponse | null>>;
    fetchCardData: (username?: string) => Promise<any>;
    fetchDetailCardData: (id: string) => Promise<any>;
    isFetchAllowed: boolean;
    setIsFetchAllowed: React.Dispatch<React.SetStateAction<boolean>>;
    specificCardData: NotionPage | null;
    setSpecificCardData: React.Dispatch<React.SetStateAction<NotionPage | null>>;
    selectedUser: string | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<string | null>>;
};

export const BrokersContext = createContext<BrokersContextProps>({
    editModalId: null,
    setEditModalId: () => { },
    cedenteModal: null,
    setCedenteModal: () => { },
    docModalInfo: null,
    setDocModalInfo: () => { },
    cardsData: null,
    setCardsData: () => {},
    fetchCardData: (username?: string) => Promise.resolve(200),
    fetchDetailCardData: () => Promise.resolve(200),
    isFetchAllowed: false,
    setIsFetchAllowed: () => { },
    specificCardData: null,
    setSpecificCardData: () => { },
    selectedUser: null,
    setSelectedUser: () => { },
    loadingCardData: false,
});

export const BrokersProvider = ({ children }: { children: React.ReactNode }) => {

    // estado que recebe o id do card que está abrindo o modal
    const [editModalId, setEditModalId] = useState<string | null>(null);

    // estado que recebe o objeto que está sendo renderizado no card
    // o objeto serve para verificação de campos como identificação
    // para fins de dinamismo na abertura do modal
    const [cedenteModal, setCedenteModal] = useState<NotionPage | null>(null);

    // estado que recebe o objeto do cedente, para controle das documentações
    // já cadastradas
    const [docModalInfo, setDocModalInfo] = useState<NotionPage | null>(null);

    // estado responsável por receber as informações (array) dos cards
    const [cardsData, setCardsData] = useState<NotionResponse | null>(null);

    // estado que recebe as informações de um card específico
    const [specificCardData, setSpecificCardData] = useState<NotionPage | null>(null);

    // estado que define se alguma request pode ser feita dentro da view
    // para evitar problemas de requisições em tempo real durante alguma
    // operação de edição ou exclusão de dados. Default = true.
    const [isFetchAllowed, setIsFetchAllowed] = useState<boolean>(true);

    // estado que recebe o username do usuário selecionado
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    // estado que define se o loading do card está ativo
    const [loadingCardData, setLoadingCardData] = useState<boolean>(false);


    // função responsável por fazer a request para a API
    async function fetchCardData(username?: string) {

        setLoadingCardData(true);
        const response = await api.get(`api/notion-api/broker/list${username ? "?user=" + username : ''}`);
        if (response !== null) {
            setCardsData(response.data);
        }
        setLoadingCardData(false);

        return response.status;

    };

    async function fetchDetailCardData(id: string) {

        const response = await api.get(`api/notion-api/list/page/${id}/`);

        if (response !== null) {
            setSpecificCardData(response.data);
        }

        return response.data;

    }

    // efeito disparado a cada 60 segundos para refetch dos dados do card
    useEffect(() => {
        if (!isFetchAllowed) return
        fetchCardData(selectedUser ?? undefined);
        const interval = setInterval(() => {
            if (!isFetchAllowed) return;
            fetchCardData(selectedUser ?? undefined);
        }, 120000); // Refatch a cada 2 minutos
        return () => clearInterval(interval);

    }, [selectedUser]);

    return (
        <BrokersContext.Provider value={{
            editModalId, setEditModalId, cedenteModal, setCedenteModal,
            cardsData, setCardsData, fetchCardData, isFetchAllowed, setIsFetchAllowed,
            docModalInfo, setDocModalInfo, fetchDetailCardData, specificCardData, setSpecificCardData, selectedUser, setSelectedUser, loadingCardData
        }}>
            {children}
        </BrokersContext.Provider>
    );
}

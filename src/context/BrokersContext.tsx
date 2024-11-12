"use client";
import { NotionPage, NotionResponse } from "@/interfaces/INotion";
import api from "@/utils/api";
import React, { createContext, useEffect, useState } from "react";

export type BrokersContextProps = {
    editModalId: string | null;
    setEditModalId: React.Dispatch<React.SetStateAction<string | null>>;
    cedenteModal: NotionPage | null;
    setCedenteModal: React.Dispatch<React.SetStateAction<NotionPage | null>>;
    cardsData: NotionResponse | null;
    setCardsData: React.Dispatch<React.SetStateAction<NotionResponse | null>>;
    fetchCardData: () => Promise<number>;
    isFetchAllowed: boolean;
    setIsFetchAllowed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BrokersContext = createContext<BrokersContextProps>({
    editModalId: null,
    setEditModalId: () => { },
    cedenteModal: null,
    setCedenteModal: () => { },
    cardsData: null,
    setCardsData: () => {},
    fetchCardData: () => Promise.resolve(200),
    isFetchAllowed: false,
    setIsFetchAllowed: () => { },
});

export const BrokersProvider = ({ children }: { children: React.ReactNode }) => {

    // estado que recebe o id do card que está abrindo o modal
    const [editModalId, setEditModalId] = useState<string | null>(null);

    // estado que recebe o objeto que está sendo renderizado no card
    // o objeto serve para verificação de campos como identificação
    // para fins de dinamismo na abertura do modal
    const [cedenteModal, setCedenteModal] = useState<NotionPage | null>(null);

    // estado responsável por receber as informações (array) dos cards
    const [cardsData, setCardsData] = useState<NotionResponse | null>(null);

    // estado que define se alguma request pode ser feita dentro da view
    // para evitar problemas de requisições em tempo real durante alguma
    // operação de edição ou exclusão de dados. Default = true.
    const [isFetchAllowed, setIsFetchAllowed] = useState<boolean>(true);

    // função responsável por fazer a request para a API
    async function fetchCardData() {

        const response = await api.get("api/notion-api/broker/list");
        if (response !== null) {
            setCardsData(response.data);
        }

        return response.status;

    };

    // efeito disparado a cada 60 segundos para refetch dos dados do card
    useEffect(() => {
        if (!isFetchAllowed) return

        fetchCardData();

        const interval = setInterval(() => {
            if (!isFetchAllowed) return;
            fetchCardData();
        }, 60000);
        return () => clearInterval(interval);

    }, []);

    return (
        <BrokersContext.Provider value={{
            editModalId, setEditModalId, cedenteModal, setCedenteModal,
            cardsData, setCardsData, fetchCardData, isFetchAllowed, setIsFetchAllowed
        }}>
            {children}
        </BrokersContext.Provider>
    );
}

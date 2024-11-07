"use client";
import { NotionPage } from "@/interfaces/INotion";
import React, { createContext, useState } from "react";

export type BrokersContextProps = {
    editModalId: string | null;
    setEditModalId: React.Dispatch<React.SetStateAction<string | null>>;
    cedenteModal: NotionPage | null;
    setCedenteModal: React.Dispatch<React.SetStateAction<NotionPage | null>>;
};

export const BrokersContext = createContext<BrokersContextProps>({
    editModalId: null,
    setEditModalId: () => { },
    cedenteModal: null,
    setCedenteModal: () => { },
});

export const BrokersProvider = ({ children }: { children: React.ReactNode }) => {

    // estado que recebe o id do card que está abrindo o modal
    const [editModalId, setEditModalId] = useState<string | null>(null);

    // estado que recebe o objeto que está sendo renderizado no card
    // o objeto serve para verificação de campos como identificação
    // para fins de dinamismo na abertura do modal
    const [cedenteModal, setCedenteModal] = useState<NotionPage | null>(null);

    return (
        <BrokersContext.Provider value={{
            editModalId, setEditModalId, cedenteModal, setCedenteModal
        }}>
            {children}
        </BrokersContext.Provider>
    );
}

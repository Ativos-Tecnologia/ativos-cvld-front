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

    const [editModalId, setEditModalId] = useState<string | null>(null);
    const [cedenteModal, setCedenteModal] = useState<NotionPage | null>(null);

    return (
        <BrokersContext.Provider value={{
            editModalId, setEditModalId, cedenteModal, setCedenteModal
        }}>
            {children}
        </BrokersContext.Provider>
    );
}

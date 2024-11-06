"use client";
import React, { createContext, useState } from "react";

export type BrokersContextProps = {
    editModalId: string | null;
    setEditModalId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const BrokersContext = createContext<BrokersContextProps>({
    editModalId: null,
    setEditModalId: () => { }
});

export const BrokersProvider = ({ children }: { children: React.ReactNode }) => {

    const [editModalId, setEditModalId] = useState<string | null>(null);

    return (
        <BrokersContext.Provider value={{ editModalId, setEditModalId }}>
            {children}
        </BrokersContext.Provider>
    );
}

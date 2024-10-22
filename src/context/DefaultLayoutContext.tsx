"use client";
import { createContext, useState } from "react";

type DefaultLayoutProps = {
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DefaultLayoutContext = createContext<DefaultLayoutProps>({
    modalOpen: false, // default value
    setModalOpen: () => { } // default value
});

export const DefaultLayoutProvider = ({ children }: { children: React.ReactNode }) => {

    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <DefaultLayoutContext.Provider value={{ modalOpen, setModalOpen }}>
            {children}
        </DefaultLayoutContext.Provider>
    )
};

'use client';
import { createContext, useState } from 'react';

type ComercialProps = {
    sheetOpen: boolean;
    setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sheetOpenId: string;
    setSheetOpenId: React.Dispatch<React.SetStateAction<string>>;
};

export const ComercialContext = createContext<ComercialProps>({
    sheetOpen: false,
    setSheetOpen: () => {},
    sheetOpenId: '',
    setSheetOpenId: () => {},
});

export const ComercialProvider = ({ children }: { children: React.ReactNode }) => {
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [sheetOpenId, setSheetOpenId] = useState<string>('');

    return (
        <ComercialContext.Provider value={{ sheetOpenId, sheetOpen, setSheetOpen, setSheetOpenId }}>
            {children}
        </ComercialContext.Provider>
    );
};

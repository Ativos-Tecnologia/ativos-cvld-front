import { createContext, useState } from "react";
import useColorMode from "@/hooks/useColorMode";

export interface IGeneralUI {
    theme: string;
    setTheme: (theme: string) => void;
}

export const GeneralUIContext = createContext<IGeneralUI>({
    theme: "light",
    setTheme: () => { },
});


export function GeneralUIProvider({ children }: { children: React.ReactNode }) {
    const [colorMode] = useColorMode();
    const [theme, setTheme] = useState(colorMode.toString() || "light");

    return (
        <GeneralUIContext.Provider value={{ theme, setTheme }}>
            {children}
        </GeneralUIContext.Provider>
    );


}

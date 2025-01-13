import { IGlobalQuery } from "@/interfaces/IGlobalQuery";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export const ReactGlobalQueryContext = React.createContext<IGlobalQuery>({
    globalQueryClient: null
});

/**
 * ReactGlobalQueryProvider is a context provider that supplies a global query client
 * to all its child components. It uses `useQueryClient` from `@tanstack/react-query`
 * to obtain the query client instance. This provider is meant to centralize all system 
 * queries, simplifying cache management and reducing errors related to undefined queries.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @return {JSX.Element} - Rendered component.
 */

export const ReactGlobalQueryProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {

    // constante do cliente global de query
    const globalQueryClient = useQueryClient();

    return <ReactGlobalQueryContext.Provider value={{
        globalQueryClient
    }}>
        {children}
    </ReactGlobalQueryContext.Provider>
}
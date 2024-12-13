import { BrokersContext } from '@/context/BrokersContext'
import { GeneralUIContext } from '@/context/GeneralUIContext'
import { UserInfoAPIContext } from '@/context/UserInfoContext'
import UseMySwal from '@/hooks/useMySwal'
import { NotionPage, NotionResponse } from '@/interfaces/INotion'
import api from '@/utils/api'
import { useContext, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { BiSearchAlt2, BiX } from 'react-icons/bi'
import { FaHandHoldingUsd } from 'react-icons/fa'

/**
 * Componente de filtro de busca por nome
 * do credor
 * 
 * @returns {JSX.Element} - O componente renderizado
 */
const CredorFilter = (): JSX.Element => {

    const {
        cardsData, setCardsData, selectedUser
    } = useContext(BrokersContext);
    const {
        data: { user }
    } = useContext(UserInfoAPIContext);
    const { theme } = useContext(GeneralUIContext);

    const swal = UseMySwal()

    const [currentSearch, setCurrentSearch] = useState<string>("");
    const [searchAuxData, setSearchAuxData] = useState<NotionResponse>();
    const [isFetchingName, setIsFetchingName] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement>(null);

    /**
     * Função que busca por um credor que não esteja na lista renderizada
     * (caso haja)
     * 
     * @param {string} name - nome do credor 
     */
    async function fetchByName(name: string): Promise<void> {
        setIsFetchingName(true);

        try {
            const response = await api.post("/api/notion-api/list/search/", {
                "username": selectedUser || user,
                "creditor_name": name
            });

            setCardsData(response.data)
        } catch (error) {
            swal.fire({
                icon: "error",
                iconColor: "#f14252",
                title: "Oops!",
                text: "Houve um erro ao buscar o credor.",
                color: `${theme === "light" ? "#64748B" : "#AEB7C0"}`,
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#1a56db",
                backdrop: false,
                background: `${theme === "light" ? "#FFF" : "#24303F"}`,
                showCloseButton: true
            })
        } finally {
            setIsFetchingName(false);
        }
    }

    /**
     * Filtra o array pelo nome do credor pesquisado
     * 
     * @returns {void}
     */
    function searchCredor(): void {
        if (searchRef.current && cardsData) {

            setCurrentSearch(searchRef.current.value);
            setSearchAuxData(cardsData)

            const hasMatch = cardsData?.results.some((item: NotionPage) =>
                item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(searchRef.current?.value.toLowerCase())
            );


            if (!hasMatch) {
                fetchByName(searchRef.current.value)
            } else {
                setCardsData({
                    ...cardsData,
                    results: cardsData?.results.filter((item: NotionPage) => item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(searchRef.current?.value.toLowerCase()))
                })
            }

        }
    }

    /**
     * Limpa o campo de busca e reseta os estados
     * e os dados da página
     * 
     * @return {void}
     */
    function clearSearch(): void {
        if (searchRef.current && searchAuxData) {
            searchRef.current.value = "";
            setCurrentSearch("");
            setCardsData(searchAuxData)
        }
    }

    return (
        <div>
            <div className='flex gap-2 items-center uppercase font-semibold text-sm mb-2'>
                <FaHandHoldingUsd />
                Filtro por credor
            </div>
            <div className='flex 2xsm:w-[215] md:w-[315px] xl:w-fit'>
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Nome do credor"
                    className='flex-1 border border-stroke dark:border-form-strokedark dark:bg-boxdark-2 h-9 text-sm uppercase rounded-tl-md rounded-bl-md focus-visible:ring-0'
                />
                <div
                    className='flex items-center justify-center w-9 h-9 cursor-pointer rounded-tr-md rounded-br-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200'
                >
                    {currentSearch ? (
                        <BiX
                            title='Desfazer pesquisa'
                            onClick={clearSearch}
                        />
                    ) : (
                        <BiSearchAlt2
                            onClick={searchCredor}
                            title='Pesquisar por credor'
                        />
                    )}
                </div>
                {isFetchingName && (
                    <AiOutlineLoading className='animate-spin' />
                )}
            </div>
        </div>
    )
}

export default CredorFilter
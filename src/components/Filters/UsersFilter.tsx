import { BrokersContext } from '@/context/BrokersContext';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { LucideChevronsUpDown } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import { AiOutlineLoading, AiOutlineSearch } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';

/**
 * Componente de filtro por usuário
 * 
 * @param {Object} props - propriedades do componente
 * @property {boolean} props.openUsersPopover - booleano que define se o filtro está aberto ou não
 * @property {Function} props.setOpenUsersPopover - Set state para abrir/fechar filtro
 * @property {boolean} props.loadingCardData - booleano que define se a página está carregando dados ou não
 * @property {Array<string>} props.filteredUsersList - Lista de usuários filtrada (por default vem vazia)
 * @property {Function} props.searchUser - função de busca por usuário
 * @returns {JSX.Element} - Componente renderizado
 */
const UsersFilter = ({ openUsersPopover, setOpenUsersPopover, loadingCardData, filteredUsersList, searchUser }: {
    openUsersPopover: boolean,
    setOpenUsersPopover: React.Dispatch<React.SetStateAction<boolean>>,
    loadingCardData: boolean,
    filteredUsersList: Array<string>,
    searchUser: (value: string) => void
}): JSX.Element => {

    /* ====> Context imports <==== */
    const {
        data: { role, user }
    } = useContext(UserInfoAPIContext);

    const {
        selectedUser, setSelectedUser
    } = useContext(BrokersContext)

    /* ====> refs <===== */
    const selectUserRef = React.useRef<HTMLDivElement>(null);
    const searchUserRef = React.useRef<HTMLInputElement>(null);

    /**
   * Foca no input de search quando o filtro de usuários
   * é aberto
   */
    useEffect(() => {
        if (openUsersPopover && searchUserRef.current) {
            searchUserRef.current.focus();
        }
    }, [openUsersPopover]);

    /**
     * Fecha o filtro de usuários sempre que é dado um clique
     * fora da sua área ou sempre que a tecla esc for pressionada
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectUserRef.current && !selectUserRef.current.contains(event.target as Node)) {
                setOpenUsersPopover(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenUsersPopover(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
            <div className="flex items-start">
                <div className="relative w-full">
                    <label className="text-sm mb-2 font-semibold text-bodydark2 dark:text-bodydark flex">
                        <BiUser className="w-5 h-5 mr-2" /> <p className="uppercase">Filtro por usuário</p>
                    </label>
                    <div className="flex items-center w-full xl:w-fit">
                        <div
                            onClick={() => {
                                setOpenUsersPopover(!openUsersPopover)
                            }}
                            className={`flex 2xsm:w-full md:w-[280px] xl:min-w-48 items-center justify-between gap-1 h-9 border border-stroke px-3 py-2 text-sm font-semibold uppercase hover:bg-slate-100 dark:border-form-strokedark dark:hover:bg-slate-700 ${openUsersPopover && "bg-slate-100 dark:bg-slate-700"} cursor-pointer rounded-md transition-colors duration-200`}
                        >
                            <span>{selectedUser || user}</span>
                            <LucideChevronsUpDown className="h-4 w-4" />
                        </div>
                        {
                            loadingCardData && <AiOutlineLoading className="ml-4 animate-spin" />
                        }
                    </div>
                    {/* ==== popover ==== */}

                    {openUsersPopover && (
                        <div
                            ref={selectUserRef}
                            className={`absolute z-20 mt-3 w-full rounded-md border border-stroke bg-white p-3 shadow-1 dark:border-strokedark dark:bg-form-strokedark ${openUsersPopover ? "visible opacity-100 animate-in fade-in-0 zoom-in-95" : " invisible opacity-0 animate-out fade-out-0 zoom-out-95"} transition-opacity duration-500`}
                        >
                            <div className="flex items-center justify-center gap-1 border-b border-stroke dark:border-bodydark2">
                                <AiOutlineSearch className="text-lg" />
                                <input
                                    ref={searchUserRef}
                                    type="text"
                                    placeholder="Pesquisar usuário..."
                                    className="w-full border-none bg-transparent focus-within:ring-0 dark:placeholder:text-bodydark2"
                                    onKeyUp={(e) => searchUser(e.currentTarget.value)}
                                />
                            </div>

                            <div className="mt-3 flex max-h-49 flex-col gap-1 overflow-y-scroll overflow-x-hidden">
                                {filteredUsersList.length > 0 &&
                                    filteredUsersList.map((user) => (
                                        <p
                                            key={user}
                                            className="cursor-pointer rounded-sm p-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                                            onClick={() => {
                                                setOpenUsersPopover(false);
                                                setSelectedUser(user);
                                            }}
                                        >
                                            {user}
                                        </p>
                                    ))}
                            </div>
                        </div>
                    )}
                    {/* ==== end popover ==== */}
                </div>
            </div>
    )
}

export default UsersFilter

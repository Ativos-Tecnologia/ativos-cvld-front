"use client"

import { Check, ChevronsUpDown } from "lucide-react";
import { useContext, useEffect, useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BrokersContext } from "@/context/BrokersContext";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { cn } from "@/lib/utils";
import api from "@/utils/api";
import { AiOutlineLoading } from "react-icons/ai";
import { BiUser } from "react-icons/bi";

/**
 * Componente de filtro de usuário
 * 
 * @returns {JSX.Element} - Componente renderizado
 */

export function UserShadFilter() {
	
  const { data: { user } } = useContext(UserInfoAPIContext);
  const { setSelectedUser, loadingCardData } = useContext(BrokersContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");  
	const [fetchedUsers, setFetchedUsers] = useState<string[]>([]);

  /**
   * @description - Hook que carrega a lista de usuários da API do Notion e coloca a lista no estado fetchedUsers.
   * @returns {void}
   * @throws {Error} - Erro ao carregar lista de usuários
   * @async
   * @sideeffect - Atualiza o estado fetchedUsers
   */

  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await api.get("/api/notion-api/list/users/");
        setFetchedUsers(response.data);
      } catch (error) {
        console.error("Erro ao carregar lista de usuários:", error);
      } 
    };
    fetchData();
  }, []);

	/**
   * @description - Essa constante é responsável por armazenar a lista de usuários, colocando o usuário logado no início da lista.
   * @constant fetchedUsers - lista de usuários carregados da API
   * @constant user - usuário logado
   * @constant users - Carrega uma lista de usuários, colocando o usuário logado no início da lista, porem se o usuário logado já estiver na lista, a lista é retornada sem alterações.
   * @returns {string[]} - lista de usuários
   * @sideeffect - Atualiza o estado users
   */
  const users = user ? (fetchedUsers.includes(user) ? fetchedUsers : [user, ...fetchedUsers]) : fetchedUsers;
	
  /**
   * Essa função é responsável por selecionar o usuário da lista e fechar o popover.
   * @param currentValue - usuário selecionado
   * @returns {void}
   * @sideeffect - Atualiza o estado selectedUser
   * @sideeffect - Atualiza o estado open
   * @throws {Error} - Erro ao selecionar usuário
   */

	const handleUserSelect = (currentValue: string) => { 
		try {
			setValue(currentValue === value ? "" : currentValue);
			setSelectedUser(currentValue);  
			setOpen(false);
		} catch (error) {
			console.error("Erro ao selecionar usuário:", error);
		} 
  };

	return (
		<div className="flex flex-col w-full text-bodydark2 dark:text-bodydark bg-white dark:bg-boxdark">
		<div className="flex w-full relative">
				<label className="text-sm mb-2 font-semibold text-bodydark2 dark:text-bodydark bg-white dark:bg-boxdark flex">
					<BiUser className="w-5 h-5 mr-2" /> <p className="uppercase">Filtro por usuário</p>
				</label>
				{
					loadingCardData && <AiOutlineLoading className="ml-4 animate-spin" />
				}
			</div>
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="2xsm:w-full xl:w-[215px] justify-between"
        >
          {value ? value : "Selecione o Usuário"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="2xsm:w-full xl:w-[215px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar Usuário" className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum Usuário Encontrado.</CommandEmpty>
            <CommandGroup>
              {users.length > 0 ? (
                users.map((userItem, index) => (
                  <CommandItem
                    key={index}
                    value={userItem}
                    onSelect={(currentValue) => handleUserSelect(currentValue)}
                  >
                    {userItem}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === userItem ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>Carregando usuários...</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
	</div>
  );
}

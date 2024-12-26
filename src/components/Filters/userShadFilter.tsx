"use client"

import { Check, ChevronsUpDown } from "lucide-react";
import React, { useContext, useEffect, useState } from 'react';

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

export function UserShadFilter() {
	
  const { data: { user } } = React.useContext(UserInfoAPIContext);
  const { selectedUser, setSelectedUser, loadingCardData } = useContext(BrokersContext);
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");  
	const [fetchedUsers, setFetchedUsers] = useState<string[]>([]);

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

	// Coloquei para o usuário logado sempre aparecer no topo da lista e ser o primeiro a ser carregado.
	const users = user ? [user, ...fetchedUsers] : fetchedUsers; 
	
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

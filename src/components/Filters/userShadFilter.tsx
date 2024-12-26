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

export function UserShadFilter() {
	
  const { data: { user } } = React.useContext(UserInfoAPIContext);
  const { selectedUser, setSelectedUser } = useContext(BrokersContext);
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");  
  const [fetchedUsers, setFetchedUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/api/notion-api/list/users/");
      console.log("Dados do usuário da API: ", response); // lembrar de remover
      setFetchedUsers(response.data);
    };

    fetchData();
  }, []);

	// Coloquei para o usuário logado sempre aparecer no topo da lista e ser o primeiro a ser carregado.
  const users = user ? [user, ...fetchedUsers] : fetchedUsers; 

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Selecione o Usuário"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setSelectedUser(currentValue);  // Atualiza o usuário selecionado no combobox do Shadcn ao dados do Broker
                      setOpen(false);
                    }}
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
  );
}

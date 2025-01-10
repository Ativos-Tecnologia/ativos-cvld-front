import * as React from "react"
import {
  ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IResumoComercial } from "@/interfaces/IResumoComercial"
import dateFormater from "@/functions/formaters/dateFormater"
import { FindCoordinator } from "@/functions/comercial/find_cordinator"

export const columns: ColumnDef<IResumoComercial>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar Tudo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecione a linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: "date_joined",
        accessorFn: (row) => dateFormater(row.date_joined.split("T")[0]),
        header: ({ column }) => {
          return (
            <Button
            variant={"ghost"}
              className="gap-2 flex items-center"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Data de Cadastro
              <ArrowUpDown size={16} />
            </Button>
          )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("date_joined")}</div>,
      },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
          variant={"ghost"}
            className="gap-2 flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Usuário
            <ArrowUpDown size={16} />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex justify-start gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p className="flex justify-start">
                Email
            </p>
            <ArrowUpDown size={16} />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    // {
    //   accessorKey: "amount",
    //   header: () => <div className="text-right">Amount</div>,
    //   cell: ({ row }) => {
    //     const amount = parseFloat(row.getValue("amount"))
    //       const formatted = new Intl.NumberFormat("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }).format(amount)
  
    //     return <div className="text-right font-medium">{formatted}</div>
    //   },
    // },
    // A próxima coluna não tem uma chave de acesso
    {
        header: "Coordenador",
        cell: ({ row }) => {
            const resumo = row.original
    
            return (
                <div className="flex items-center">
                    <span>{FindCoordinator(resumo.username)}</span>
                </div>
            )
        },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const resumo = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(`${resumo.id}`)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
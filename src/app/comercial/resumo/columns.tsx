import * as React from "react"
import {
    Column,
  ColumnDef,
} from "@tanstack/react-table"

type CustomColumnDef<T> = ColumnDef<T, unknown> & {
  filterVariant?: 'range' | 'select' | 'text'
}
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
import api from "@/utils/api"
import { useMutation } from "@tanstack/react-query"
import CRMTooltip from "@/components/CrmUi/Tooltip"
import { toast, Toaster } from "sonner"
import { BiCheck } from "react-icons/bi"

// function Filter({ column }: { column: Column<any, unknown> }) {
//     const columnFilterValue = column.getFilterValue()
//     const { filterVariant } = column.columnDef as ColumnDef<any, unknown>
  
//     return filterVariant === 'range' ? (
//       <div>
//         <div className="flex space-x-2">
//           {/* See faceted column filters example for min max values functionality */}
//           <DebouncedInput
//             type="number"
//             value={(columnFilterValue as [number, number])?.[0] ?? ''}
//             onChange={value =>
//               column.setFilterValue((old: [number, number]) => [value, old?.[1]])
//             }
//             placeholder={`Min`}
//             className="w-24 border shadow rounded"
//           />
//           <DebouncedInput
//             type="number"
//             value={(columnFilterValue as [number, number])?.[1] ?? ''}
//             onChange={value =>
//               column.setFilterValue((old: [number, number]) => [old?.[0], value])
//             }
//             placeholder={`Max`}
//             className="w-24 border shadow rounded"
//           />
//         </div>
//         <div className="h-1" />
//       </div>
//     ) : filterVariant === 'select' ? (
//       <select
//         onChange={e => column.setFilterValue(e.target.value)}
//         value={columnFilterValue?.toString()}
//       >
//         {/* See faceted column filters example for dynamic select options */}
//         <option value="">All</option>
//         <option value="complicated">complicated</option>
//         <option value="relationship">relationship</option>
//         <option value="single">single</option>
//       </select>
//     ) : (
//       <DebouncedInput
//         className="w-36 border shadow rounded"
//         onChange={value => column.setFilterValue(value)}
//         placeholder={`Search...`}
//         type="text"
//         value={(columnFilterValue ?? '') as string}
//       />
//       // See faceted column filters example for datalist search suggestions
//     )
//   }
  
//   // A typical debounced input react component
//   function DebouncedInput({
//     value: initialValue,
//     onChange,
//     debounce = 500,
//     ...props
//   }: {
//     value: string | number
//     onChange: (value: string | number) => void
//     debounce?: number
//   } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
//     const [value, setValue] = React.useState(initialValue)
  
//     React.useEffect(() => {
//       setValue(initialValue)
//     }, [initialValue])
  
//     React.useEffect(() => {
//       const timeout = setTimeout(() => {
//         onChange(value)
//       }, debounce)
  
//       return () => clearTimeout(timeout)
//     }, [value])
  
//     return (
//       <input {...props} value={value} onChange={e => setValue(e.target.value)} />
//     )
//   }

export const columns: ColumnDef<IResumoComercial>[] = [
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
        <div>{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => <CRMTooltip text="Seguir para o WhatsApp"><a href={
        `https://api.whatsapp.com/send?phone=55${(row.getValue("phone") as string)?.replace(/\D/g, "")}`
      } target="_blank" className="lowercase">{row.getValue("phone")}</a></CRMTooltip>,
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
      cell: ({ row }) => <a href={
        `mailto:${row.getValue("email")}?subject=Boas%20vindas%20ao%20Celer`
      } className="lowercase">{row.getValue("email")}</a>,
    },
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
        accessorKey: "is_confirmed",
        header: "Confirmado",
        cell: ({ row }) => (
          <div id={String(row.original.id)} className="flex items-center">
            {row.getValue("is_confirmed") ? "Sim" : "Não"}
          </div>
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const resumo = row.original

        function handleCopyPhone() {
          navigator.clipboard.writeText(`${resumo.phone}`)
        }

        async function handleConfirmUser() {
            return await api.patch(`/api/comercial/confirm-user/${resumo.id}/`)
        }

        const handleConfirmMutation = useMutation({

            mutationFn: handleConfirmUser,
            onMutate(variables) {
                const prevData = document.getElementById(String(resumo.id))!.textContent
                resumo.is_confirmed = true
                document.getElementById(String(resumo.id))!.textContent = "Sim"
                return { prevData }
            },
            onSuccess: () => {
                toast.success("Usuário confirmado", {
                classNames: {
                    toast: "bg-white dark:bg-boxdark",
                    title: "text-black-2 dark:text-white",
                    actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                },
                icon: <BiCheck className="text-lg fill-green-400" />,
                action: {
                    label: "OK",
                    onClick() {
                        toast.dismiss();
                    },
                }
            });            },
            onError: (error, paramsObj, context) => {
                resumo.is_confirmed = false
                document.getElementById(String(resumo.id))!.textContent = context?.prevData as string
                toast.error("Erro ao confirmar usuário", {
                    classNames: {
                        toast: "bg-white dark:bg-boxdark",
                        title: "text-black-2 dark:text-white",
                        actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
                    },
                    icon: <BiCheck className="text-lg fill-red-400" />,
                    action: {
                        label: "OK",
                        onClick() {
                            toast.dismiss();
                        },
                    }
                });
            },
        })

        const actionConfirmUser = async () => {
            await handleConfirmMutation.mutateAsync()
        }
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-boxdark-2">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleCopyPhone}
              >
                Copiar telefone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={resumo.is_confirmed} onClick={actionConfirmUser}>Confirmar usuário</DropdownMenuItem>
              <DropdownMenuItem disabled>Solicitar designação</DropdownMenuItem>
              <DropdownMenuItem disabled>Redefinir senha</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
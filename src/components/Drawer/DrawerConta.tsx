import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import { Drawer, Flowbite } from 'flowbite-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { HiCalendar } from 'react-icons/hi';
import { BiCopy } from 'react-icons/bi';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { ShadSelect } from '../ShadSelect';
import { SelectItem } from '../ui/select';

export function DrawerConta({ loading, open, setOpen }: { loading: boolean, open: boolean, setOpen: any }) {
  const selectRef = React.useRef<HTMLDivElement | null>(null);

  const { register, handleSubmit, control } = useForm();
  const onSubmit = (data: any) => console.log(data);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Flowbite theme={{ theme: customFlowBiteTheme }}>
        <Drawer open={open} onClose={handleClose} className='w-[360px]'>
          <Drawer.Header title="NOVA CONTA" titleIcon={AiOutlineUserAdd} />
          <Drawer.Items>
            {/* <p className="text-sm text-center">Crie uma nova tarefa para o extrato</p> */}
            <form onSubmit={handleSubmit(onSubmit)} className='mt-20'>
              <div className="mb-8">
                <label htmlFor="nome_razao_social" className="mb-2 block text-sm font-semibold">
                  Nome / Razão Social
                </label>
                <input type='text' id="nome_razao_social" className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2" {
                  ...register("nome_razao_social")

                } />

              </div>
              <div className="mb-8 flex flex-col gap-4">
                <div>

                  <label htmlFor="cpf_cnpj_conta" className="mb-2 block text-sm font-semibold">
                    CPF / CNPJ
                  </label>
                  <input type='text' id="cpf_cnpj_conta" className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2" {
                    ...register("cpf_cnpj_conta")

                  } />
                </div>
                <div className='flex flex-row align-bottom rounded-md justify-end'>
                  <Dialog>
                    <DialogTrigger className={`${open && 'text-black dark:text-white'} border-b flex items-center gap-1 p-1 mb-1 cursor-pointer w-fit hover:text-black dark:hover:text-white transition-all duration-200`}><BiPlus />
                      <span className="text-xs">
                        Vincular Pessoa
                      </span></DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                          Anyone who has this link will be able to view this.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <Input
                            id="link"
                            defaultValue="https://ui.shadcn.com/docs/installation"
                            readOnly
                          />
                        </div>
                        <Button type="submit" size="sm" className="px-3">
                          <span className="sr-only">Copy</span>
                          <BiCopy className="h-4 w-4" />
                        </Button>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 mb-8'>
                <div className='grid grid-cols-1'>
                  <label htmlFor="agencia" className="block text-sm mb-2 font-semibold">
                    Natureza
                  </label>
                  <ShadSelect name="natureza" control={control}>
                    <SelectItem value="PF">Pessoa Física</SelectItem>
                    <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                  </ShadSelect>
                </div>
                <div className='grid grid-cols-1'>
                  <label htmlFor="origem" className="block text-sm mb-2 font-semibold">
                    Origem
                  </label>



                  <ShadSelect name="origem" control={control}>
                    <SelectItem value="midias_sociais">Mídias Sociais</SelectItem>
                    <SelectItem value="organico">Organico</SelectItem>
                  </ShadSelect>
                </div>

              </div>
              <div className="mb-6 w-full">
                <label htmlFor="conta" className="block text-sm mb-2 font-semibold">
                  Classificação
                </label>
                <ShadSelect name="conta" control={control}>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="passivo">Passivo</SelectItem>
                  <SelectItem value="patrimonio_liquido">Patrimônio Líquido</SelectItem>
                </ShadSelect>

                {/* <input type="date" id="due_date" placeholder="Data de entrega" className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2" {
                  ...register("due_date")

                } /> */}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">


              </div>
              {/* <div className="mb-6">
              <TextInput
                id="guests"
                name="guests"
                placeholder="Enviar convite para..."
                type="search"
                rightIcon={() => (
                  <Button size="sm" className="[&>span]:items-center [&>span]:px-2 [&>span]:py-0">
                    <HiUserAdd className="mr-2" />
                    Add
                  </Button>
                )}
                theme={{
                  field: {
                    rightIcon: {
                      base: twMerge(theme.textInput.field.rightIcon.base, "pointer-events-auto"),
                    },
                  },
                }}
              />
            </div>
            <Avatar.Group className="mb-6">
              <Avatar alt="" img="/images/people/profile-picture-5.jpg" rounded size="sm" stacked />
              <Avatar alt="" img="/images/people/profile-picture-2.jpg" rounded size="sm" stacked />
              <Avatar alt="" img="/images/people/profile-picture-3.jpg" rounded size="sm" stacked />
              <Avatar alt="" img="/images/people/profile-picture-4.jpg" rounded size="sm" stacked />
            </Avatar.Group> */}
              <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-all duration-200" type="submit">
                <HiCalendar className="mr-2" />
                Criar Tarefa
              </button>
            </form>
          </Drawer.Items>
        </Drawer>
      </Flowbite>


    </>
  );
}


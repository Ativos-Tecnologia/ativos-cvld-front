import { Avatar, Badge, Button, Datepicker, Drawer, Label, Textarea, TextInput, theme } from "flowbite-react";
import { Suspense, useState } from "react";
import { BiTask } from "react-icons/bi";
import { HiCalendar, HiUserAdd } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import {
  useForm, SubmitHandler,
  Controller
} from 'react-hook-form';
import api from "@/utils/api";

export type TaskDrawerProps = {
  open: boolean;
  setOpen: any;
  id: string;
};

export function TaskDrawer({ open, setOpen, id }: TaskDrawerProps) {


  const { register, control, handleSubmit, watch, formState: { errors } } = useForm();

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<any> = async (data) => {
    data["extrato_id"] = id;
    const response = await api.post("api/task/create/", data);
    console.log(response);
  };

  return (
    <>
      {/* <div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={}>Show drawer</Button>
      </div> */}


      <Drawer open={open} onClose={handleClose} className="dark:bg-boxdark">
        <Drawer.Header title="NOVA TAREFA" titleIcon={BiTask} className="dark:text-white" />
        <Drawer.Items>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Crie uma nova tarefa para o extrato</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-6">
              <Label htmlFor="title" className="mb-2 block">
                Título
              </Label>
              <TextInput id="title" placeholder="Apple Keynote" {
                ...register("title")

              } />
            </div>
            <div className="mb-6">
              <Label htmlFor="description" className="mb-2 block">
                Descrição
              </Label>
              <Textarea id="description" placeholder="Write event description..." rows={4} {
                ...register("description")

              } />
            </div>
            <div className="mb-6 w-full">
              <input type="date" id="due_date" placeholder="Data de entrega" className="block w-full rounded-lg border text-sm disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500" {
                ...register("due_date")

              } />
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
            <button className="w-full flex items-center justify-center align-middle bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 dark:bg-cyan-700 dark:hover:bg-cyan-800" type="submit">
              <HiCalendar className="mr-2 items-center" />
              Criar Tarefa
            </button>
          </form>
        </Drawer.Items>
      </Drawer>
    </>
  );
}

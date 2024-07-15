import { Drawer, Flowbite } from "flowbite-react";
import { Suspense, useState } from "react";
import { BiTask } from "react-icons/bi";
import { HiCalendar, HiUserAdd } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { customDrawerTheme } from "@/themes/FlowbiteThemes";
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
  };

  return (
    <>
      {/* <div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={}>Show drawer</Button>
      </div> */}
      <Flowbite theme={{ theme: customDrawerTheme }}>
        <Drawer open={open} onClose={handleClose}>
          <Drawer.Header title="NOVA TAREFA" titleIcon={BiTask} />
          <Drawer.Items>
            <p className="text-sm text-center">Crie uma nova tarefa para o extrato</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-6">
                <label htmlFor="title" className="mb-2 block">
                  Título
                </label>
                <input type='text' id="title" placeholder="Apple Keynote"
                  {...register("title")}
                  className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="mb-2 block">
                  Descrição
                </label>
                <textarea id="description" placeholder="Write event description..." rows={4}
                  {...register("description")}
                  className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
              </div>
              <div className="mb-6 w-full">
                <input type="date" id="due_date" placeholder="Data de entrega" className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2" {...register("due_date")} />
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

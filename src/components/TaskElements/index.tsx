import { Avatar, Badge, Button, Datepicker, Drawer, Flowbite, Label, Textarea, TextInput, theme } from "flowbite-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { BiTask } from "react-icons/bi";
import { HiCalendar, HiUserAdd } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { customDrawerTheme } from "@/themes/FlowbiteThemes";
import {
  useForm, SubmitHandler,
  Controller
} from 'react-hook-form';
import api from "@/utils/api";
import MarvelousSelect from "../MarvelousSelect";

export type TaskDrawerProps = {
  open: boolean;
  setOpen: any;
  id: string;
};

export type TaskRelatedItems = {
  id: string;
  [key: string]: string;
};

export function TaskDrawer({ open, setOpen, id }: TaskDrawerProps) {

  const taskTitlePlaceholders = ["Entrar em contato com o cliente", "Reunião com a equipe", "Reunião com o cliente", "Reunião com o fornecedor", "Reunião com o time de desenvolvimento", "Reunião com o time de marketing", "Reunião com o time de vendas"];

  const taskDescriptionPlaceholders = ["Necessário entrar em contato com o cliente para alinhar as expectativas", "Reunião com a equipe para alinhar as metas do mês", "Reunião com o cliente para apresentar o novo projeto", "Reunião com o fornecedor para alinhar as entregas", "Reunião com o time de desenvolvimento para alinhar as entregas", "Reunião com o time de marketing para alinhar as entregas", "Reunião com o time de vendas para alinhar as entregas"];


  const { register, control, handleSubmit, watch, formState: { errors } } = useForm();
  const [taskStatus, setTaskStatus] = useState(Array<TaskRelatedItems>());
  const [taskGoals, setTaskGoals] = useState(Array<TaskRelatedItems>());
  const selectRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<any> = async (data) => {
    data["extrato_id"] = id;
    const response = await api.post("api/task/create/", data);
  };

  const fetchTaskStatus = async () => {
    const response = await api.get("api/task/status/");
    if (response.status === 200) {
      setTaskStatus(response.data);
    } else {
      console.log("Error fetching task status");
    }
  }

  const fetchTaskGoals = async () => {
    const response = await api.get("api/task/goals/");
    if (response.status === 200) {
      setTaskGoals(response.data);
    } else {
      console.log("Error fetching task goals");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchTaskStatus()]);
      await Promise.all([fetchTaskGoals()]);
    }
    fetchData();
  }, []);


  return (
    <>
      {/* <div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={}>Show drawer</Button>
      </div> */}

      <Flowbite theme={{ theme: customDrawerTheme }}>
        <Drawer open={open} onClose={handleClose} className="w-[360px]">
          <Drawer.Header title="NOVA TAREFA" titleIcon={BiTask} className="dark:text-white" />
          <Drawer.Items>
            <p className="text-sm text-center">Crie uma nova tarefa para o extrato</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-6">
                <label htmlFor="title" className="mb-2 block">
                  Título
                </label>
                <input type='text' id="title" placeholder={
                  taskTitlePlaceholders[Math.floor(Math.random() * taskTitlePlaceholders.length)]
                }
                  {...register("title")}
                  className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="mb-2 block">
                  Descrição
                </label>
                <textarea id="description" placeholder={
                  taskDescriptionPlaceholders[Math.floor(Math.random() * taskDescriptionPlaceholders.length)]
                } rows={4}
                  {...register("description")}
                  className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
              </div>
              <div className="mb-6 w-full">
                <input type="date" id="due_date" placeholder="Data de entrega" className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2" {
                  ...register("due_date")

                } />
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <Badge size="sm" color="cyan" className="mb-2 px-0">
                  <select id="status" className="text-[10px] w-full overflow-hidden text-ellipsis whitespace-nowrap focus-within:ring-0 bg-transparent border-none py-0 col-span-1" {
                    ...register("statusName")

                  }>
                    <option className={
                      "text-[10px] bg-transparent border-none py-0 col-span-1"
                    } defaultValue={""} value="" disabled><span className="pl-0 text-indigo-900">STATUS DA TAREFA</span></option>
                    <option className="text-[10px] bg-transparent border-none py-0 col-span-1" value="">VAZIO</option>
                    <hr className="col-span-2 py-2" />
                    {taskStatus.map((status) => (
                      <option
                      key={status.id} 
                      value={status.id}>{status.statusName.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </Badge>
                {/* <Badge size="sm" color="lime" className="mb-2 px-0">
              <select id="goal" className="text-[10px] bg-transparent border-none py-0 col-span-1" {
                ...register("goalName")

              }>
                <option defaultValue={""} value="" disabled>METAS</option>
                <option className="text-[10px] bg-transparent border-none py-0 col-span-1" value="">VAZIO</option>
                <hr className="col-span-2 py-2" />
                {taskGoals.map((status) => (
                  <option key={status.id} value={status.id}>{status.goalName}</option>
                ))}
              </select>
              </Badge> */}
                <Controller
                  name="goalName"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <MarvelousSelect
                      label="METAS"
                      data={taskGoals}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      nameRef="goalName"
                    />
                  )}
                />
              </div>
              {/* <div className="mb-6">
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

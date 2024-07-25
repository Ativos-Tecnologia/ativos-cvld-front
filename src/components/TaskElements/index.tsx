import { Avatar, Badge, Datepicker, Drawer, Flowbite, Label, Textarea, TextInput, theme } from "flowbite-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { BiCalendarAlt, BiTask } from "react-icons/bi";
import { HiCalendar, HiUserAdd } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { customFlowBiteTheme } from "@/themes/FlowbiteThemes";
import {
  useForm, SubmitHandler,
  Controller
} from 'react-hook-form';
import api from "@/utils/api";
import MarvelousSelect from "../MarvelousSelect";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Button } from "../ui/button";

export type TaskDrawerProps = {
  open: boolean;
  setOpen: any;
  id: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

export type TaskRelatedItems = {
  id: string;
  statusName?: string;
  goalName?: string;
  nameRef?: string;
  title: string;
  non_editable?: boolean;
};

// export interface TaskRelatedItems {
//   id: string;
// }


export function TaskDrawer({ open, setOpen, id }: TaskDrawerProps) {

  const [taskTitlePlaceholders, setTaskTitlePlaceholders] = useState<string>('');
  const [taskDescriptionPlaceholders, setTaskDescriptionPlaceholders] = useState<string>('')
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm();
  const [taskStatus, setTaskStatus] = useState<PaginatedResponse<TaskRelatedItems>>({ count: 0, next: "", previous: "", results: [] });
  const [taskGoals, setTaskGoals] = useState<PaginatedResponse<TaskRelatedItems>>({ count: 0, next: "", previous: "", results: [] });
  const [date, setDate] = useState<Date>();

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<any> = async (data) => {
    data["extrato_id"] = id;
    data["due_date"] = format(date!, "yyyy-MM-dd");
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

    const titleTemplatePlaceholders: string[] = ["Entrar em contato com o cliente", "Reunião com a equipe", "Reunião com o cliente", "Reunião com o fornecedor", "Reunião com o time de desenvolvimento", "Reunião com o time de marketing", "Reunião com o time de vendas"];
    const descriptionTemplatePlaceholders: string[] = ["Necessário entrar em contato com o cliente para alinhar as expectativas", "Reunião com a equipe para alinhar as metas do mês", "Reunião com o cliente para apresentar o novo projeto", "Reunião com o fornecedor para alinhar as entregas", "Reunião com o time de desenvolvimento para alinhar as entregas", "Reunião com o time de marketing para alinhar as entregas", "Reunião com o time de vendas para alinhar as entregas"];

    setTaskTitlePlaceholders(titleTemplatePlaceholders[Math.floor(Math.random() * titleTemplatePlaceholders.length)]);
    setTaskDescriptionPlaceholders(descriptionTemplatePlaceholders[Math.floor(Math.random() * descriptionTemplatePlaceholders.length)]);

  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchTaskStatus()]);
      await Promise.all([fetchTaskGoals()]);
    }
    fetchData();
  }, []);


  return (
    <>
      <Flowbite theme={{ theme: customFlowBiteTheme }}>
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
                  `Ex: ${taskTitlePlaceholders}`
                }
                  {...register("title")}
                  className="w-full rounded-md text-ellipsis overflow-hidden whitespace-nowrap border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="mb-2 block">
                  Descrição
                </label>
                <textarea id="description" placeholder={
                  `Ex: ${taskDescriptionPlaceholders}`
                } rows={4}
                  {...register("description")}
                  className="w-full rounded-md resize-none border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
              </div>
              <div className="mb-6 w-full">
                <label htmlFor="due_date" className="mb-2 block">
                  Data de entrega
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={"w-full justify-start text-left font-normal"}
                    >
                      <BiCalendarAlt className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data de entrega</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      locale={ptBR}
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* <input type="date" id="due_date" placeholder="Data de entrega" className="w-full rounded-md border-stroke shadow-1 dark:border-strokedark dark:bg-boxdark-2" {
                  ...register("due_date")

                } /> */}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">

                <Controller
                  name="statusName"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <MarvelousSelect
                      label="STATUS"
                      data={taskStatus}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      nameRef="statusName"
                      setData={setTaskStatus as unknown as React.Dispatch<React.SetStateAction<PaginatedResponse<TaskRelatedItems>>>}
                    />
                  )}
                />
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
                      setData={setTaskGoals as unknown as React.Dispatch<React.SetStateAction<PaginatedResponse<TaskRelatedItems>>>}
                    />
                  )}
                />
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

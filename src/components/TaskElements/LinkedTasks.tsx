import React, { useEffect, useRef, useState } from 'react'
import { BiChevronDown, BiMinus, BiPencil, BiPlus } from 'react-icons/bi'
import { HiDocument } from 'react-icons/hi'
import { VscChevronDown, VscEdit } from 'react-icons/vsc'
import { PaginatedResponse, TaskDrawer } from '.'
import { CVLDResultProps } from '@/interfaces/IResultCVLD'
import api from '@/utils/api'

export interface ILinkedTasksProps {
  data: any;
  index: number;
  openTaskDrawer: boolean;
  setOpenTaskDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  openSubTask: string | null;
  setOpenSubTask: React.Dispatch<React.SetStateAction<string | null>>;
  editableTaskInput: boolean;
  setEditableTaskInput: React.Dispatch<React.SetStateAction<boolean>>;
  type?: string;
}

export type LinkedTaskProps = {
  completed: boolean;
  created_at: string;
  description: string;
  due_date: string;
  extrato_id: string;
  goalName: string;
  id: string;
  statusName: string;
  title: string;
  updated_at: string;
  user: number;
  related_table_id: string | null;
  position: number;
}

export const LinkedTasks = ({ data, openTaskDrawer, setOpenTaskDrawer, openSubTask, setOpenSubTask, editableTaskInput, setEditableTaskInput, type }: ILinkedTasksProps) => {

  const [extratoTasks, setExtratoTasks] = useState<PaginatedResponse<LinkedTaskProps>>({
    count: 0,
    next: "",
    previous: "",
    results: []
  })
  const [subtasks, setSubtasks] = useState<string[]>([
    "Subtarefa 1: Assinar um documento",
    "Subtarefa 2: Fazer alguma coisa",
    "Subtarefa 3: Fazer alguma coisa",
  ]);

  /* ====> refs <==== */
  const headInputRefs = useRef<HTMLInputElement[] | null>([]);
  const subInputRefs = useRef<HTMLInputElement[] | null>([]);
  /* ====> end refs <==== */


  function handleEditTask(index: number) {
    setEditableTaskInput(true);
  }

  function handleAddSubtask(index: number) {
    if (subInputRefs.current![index].value.trim()) {
      setSubtasks([...subtasks, subInputRefs.current![index].value]);
      subInputRefs.current![index].value = '';
    }
  }

  function handleDeleteSubtask(subtask: string) {
    const newSubtasks = subtasks.filter(st => st !== subtask);
    setSubtasks(newSubtasks);
  }

  useEffect(() => {

    async function fetchData() {
      const response = await api.get(`/api/task/list/${data.id}/`);

      if (response.status !== 200) {
        console.log('erro ao obter as tarefas vinculadas');
        return;
      };

      setExtratoTasks(response.data);

    }

    fetchData();
  }, [])

  return (
    <div className="flex flex-col my-5 pb-5 border-b dark:border-form-strokedark">
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-boxdark dark:text-white">Tarefas vinculadas</h2>
        <button
          title={openTaskDrawer ? 'Cancelar' : 'Adicionar Tarefa'}
          className="flex items-center justify-center self-center w-7 h-7 hover:bg-slate-200 dark:hover:bg-form-strokedark rounded-full transition-all duration-200"
          onClick={() => setOpenTaskDrawer(!openTaskDrawer)}>
          <BiPlus className={`${openTaskDrawer ? 'rotate-[135deg]' : 'rotate-0'} text-xl transition-all duration-300`} />
        </button>
      </div>

      <ul className={`mt-3 transition-all duration-300`}>
        {extratoTasks.results.length > 0 ? (
          <React.Fragment>
            {
              extratoTasks.results.map((task, index) => (
                <li key={task.id} className="rounded-md p-1 hover:shadow-3 dark:hover:shadow-body transition-all duration-200 group">
                  <div className="relative flex flex-col px-1">
                    {/* ===== absolute div that covers the task name if no editable ===== */}
                    {!editableTaskInput && (
                      <div className="absolute w-full h-7 overflow-hidden cursor-default flex items-center justify-end">
                        <div
                          title="Editar Tarefa"
                          onClick={() => handleEditTask(0)}
                          className='py-1 px-2 mr-1 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 translate-x-9 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'>
                          <BiPencil  className="dark:text-white" />
                        </div>
                        <div
                          title="Expandir Tarefa"
                          onClick={() => setOpenSubTask(openSubTask === task.id ? null : task.id)}
                          className='py-1 px-2 mr-3 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 translate-x-9 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'>
                          <BiChevronDown className={`text-lg dark:text-white ${openSubTask && 'rotate-180'} transition-all duration-300`} />
                        </div>
                      </div>
                    )}
                    {/* ===== end absolute div that covers the task if no editable ===== */}

                    {/* ===== principal content ===== */}
                    <div className="flex items-center">
                      <div className={`relative bg-snow dark:bg-boxdark z-2 flex items-center justify-center rounded-full w-7 h-7 ${openSubTask === task.id ? 'border border-slate-300 dark:border-bodydark duration-1000 delay-200' : 'duration-200 delay-0'} transition-[border]`}>
                        <HiDocument className="text-xl" />
                      </div>
                      {/* <span className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">Task 1: Mandar documentação para Tribunal de Justiça para assinatura</span> */}
                      <input
                        type="text"
                        className="w-full py-1 px-2 bg-transparent border-none focus-within:ring-0 rounded-md text-ellipsis overflow-hidden whitespace-nowrap"
                        defaultValue={task.title}
                        disabled={!editableTaskInput}
                        onKeyUp={(e) => {
                          console.log(e.key)
                        }}
                      />
                    </div>
                    {/* ===== end principal content ===== */}
                  </div>
                  {/* ===== task steps content */}
                  <div className={`${openSubTask === task.id ? 'max-h-[900px] my-2 animate-in fade-in-0 zoom-in-95' : 'overflow-hidden max-h-0 animate-out fade-out-0 zoom-out-95'} transition-all duration-300`}>
                    {subtasks.length > 0 &&
                      <ul
                        className={`ml-7 flex flex-col gap-2`}>
                        {subtasks.map(subtask => (
                          <li key={subtask} className="flex items-center justify-between gap-2 peer">
                            <label htmlFor={subtask} className="relative flex items-center gap-2 cursor-pointer">
                              <div className={`${openSubTask === task.id ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute -left-3 -top-[18px] w-3 h-8 border-l border-b border-slate-300 dark:border-bodydark self-start transition-all duration-1000 delay-200`}></div>
                              <input
                                id={subtask}
                                type="checkbox"
                                className="w-3 h-3 bg-transparent focus-within:ring-0 selection:ring-0 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer"
                              />
                              <span className='max-w-[330px] text-ellipsis overflow-hidden whitespace-nowrap'>
                              {subtask}
                              </span>
                            </label>
                            <button
                              title='Deletar'
                              className="flex items-center justify-center self-center w-8 h-5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-all duration-200"
                              onClick={() => handleDeleteSubtask(subtask)}
                            >
                              <BiMinus />
                            </button>
                          </li>
                        ))}
                      </ul>
                    }
                    <div className='relative flex items-center gap-2 px-3 my-2'>
                      <input
                        ref={(input) => { if (input) subInputRefs.current![index] = input; }}
                        type="text"
                        placeholder='adicionar subtarefa'
                        // style={{
                        //   border: 'none',
                        //   borderBottom: '1px solid #ddd'
                        // }}
                        className="w-full py-1 px-2 h-8 border-l-0 border-t-0 border-r-0 border-b border-b-stroke dark:border-b-form-strokedark bg-transparent focus-within:ring-0 text-ellipsis overflow-hidden whitespace-nowrap placeholder:italic placeholder:text-gray-500 dark:placeholder:text-slate-500"
                      />
                      <button
                        title='Adicionar'
                        className="absolute right-[13px] flex items-center justify-center self-center w-7 h-7 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all duration-200"
                        onClick={() => handleAddSubtask(index)}
                      >
                        <BiPlus className='text-xl transition-all duration-300' />
                      </button>
                    </div>
                  </div>
                  {/* ===== end task steps content */}
                </li>
              ))
            }
          </React.Fragment>
        ) : (
          <p className="text-sm text-center my-3">o extrato não possui tarefas.</p>
        )}
      </ul>

      <div className={`w-full px-px overflow-hidden ${openTaskDrawer ? 'max-h-[900px] my-5 border-t border-stroke dark:border-form-strokedark' : 'max-h-0'} transition-ease-in-out`}>
        <TaskDrawer id={data.id} extratoTasks={extratoTasks} setExtratosTasks={setExtratoTasks} />
      </div>

      {/* end task drawer */}
    </div>
  )
}

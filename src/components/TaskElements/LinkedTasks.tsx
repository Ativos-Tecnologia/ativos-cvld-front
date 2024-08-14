import React, { useEffect, useRef, useState } from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { HiDocument } from 'react-icons/hi'
import { VscChevronDown, VscEdit } from 'react-icons/vsc'
import { PaginatedResponse, TaskDrawer } from '.'
import { CVLDResultProps } from '@/interfaces/IResultCVLD'
import api from '@/utils/api'

interface ILinkedTasksProps {
  data: any;
  openTaskDrawer: boolean;
  setOpenTaskDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  openSubTask: boolean;
  setOpenSubTask: React.Dispatch<React.SetStateAction<boolean>>;
  editableTaskInput: boolean;
  setEditableTaskInput: React.Dispatch<React.SetStateAction<boolean>>;
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
}

export const LinkedTasks = ({ data, openTaskDrawer, setOpenTaskDrawer, openSubTask, setOpenSubTask, editableTaskInput, setEditableTaskInput }: ILinkedTasksProps) => {

  const [extratoTasks, setExtratoTasks] = useState<PaginatedResponse<LinkedTaskProps>>({
    count: 0,
    next: "",
    previous: "",
    results: []
  })
  const [subtasks, setSubtasks] = useState<string[]>([
    "Subtarefa 1: Assinar um documento"
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleEditTask(index: number) {
    setEditableTaskInput(true);
  }

  function handleAddSubtask() {
    if (inputRef.current && inputRef.current.value.trim()) {
      setSubtasks([...subtasks, inputRef.current.value]);
      inputRef.current.value = '';
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
              extratoTasks.results.map(task => (
                <li key={task.id} className="rounded-md p-1 hover:shadow-3 dark:hover:shadow-body transition-all duration-200 group">
                  <div className="relative flex flex-col px-1">
                    {/* ===== absolute div that covers the task name if no editable ===== */}
                    {!editableTaskInput && (
                      <div className="absolute w-full h-7 overflow-hidden cursor-default flex items-center justify-end gap-1">
                        <div
                          title="Editar Tarefa"
                          onClick={() => handleEditTask(0)}
                          className='py-1 px-2 mr-1 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 translate-x-9 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'>
                          <VscEdit className="text-sm text-black-2 dark:text-white" />
                        </div>
                        <div
                          title="Expandir Tarefa"
                          onClick={() => setOpenSubTask(!openSubTask)}
                          className='py-1 px-2 mr-3 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 translate-x-9 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'>
                          <VscChevronDown className={`text-sm text-black-2 dark:text-white ${openSubTask && 'rotate-180'} transition-all duration-300`} />
                        </div>
                      </div>
                    )}
                    {/* ===== end absolute div that covers the task if no editable ===== */}

                    {/* ===== principal content ===== */}
                    <div className="flex items-center">
                      <HiDocument className="text-xl" />
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
                  <div className={` overflow-hidden ${openSubTask ? 'max-h-[900px] my-2 animate-in fade-in-0 zoom-in-95' : 'max-h-0 animate-out fade-out-0 zoom-out-95'} transition-all duration-300`}>
                    {subtasks.length > 0 &&
                      <ul
                        className={`ml-6 flex flex-col gap-2`}>
                        {subtasks.map(subtask => (
                          <li key={subtask} className="flex items-center justify-between gap-2 peer">
                            <label htmlFor={subtask} className="flex items-center gap-2 cursor-pointer">
                              <input
                                id={subtask}
                                type="checkbox"
                                className="w-3 h-3 bg-transparent focus-within:ring-0 selection:ring-0 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer"
                              />
                              {subtask}
                            </label>
                            <button
                              title='Deletar'
                              className="flex items-center justify-center self-center w-8 h-5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md transition-all duration-200"
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
                        ref={inputRef}
                        type="text"
                        placeholder='adicionar nova subtarefa'
                        className="w-full py-1 px-2 h-8 bg-transparent border-slate-200 dark:border-slate-600 rounded-md text-ellipsis overflow-hidden dark:bg-boxdark-2 whitespace-nowrap"
                      />
                      <button
                        title='Adicionar'
                        className="absolute right-[13px] flex items-center justify-center self-center border bg-slate-200 w-13 h-[31px] hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 rounded-md transition-all duration-200"
                        onClick={handleAddSubtask}
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

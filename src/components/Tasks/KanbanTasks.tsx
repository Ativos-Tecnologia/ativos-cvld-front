"use client";
import React, { useCallback, useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TaskHeader from "@/components/TaskHeader";
import api from "@/utils/api";
import { LinkedTaskProps } from "../TaskElements/LinkedTasks";
import { TaskColumns } from "./TaskColumns";
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

/* ----> types <---- */
export type TaskColumnProps = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  color: string;
  position: number;
  user: number;
  type?: string;
}


const TaskKanban: React.FC = () => {

  /* ----> states <----- */
  const [taskColumnsList, setTaskColumnsList] = useState<TaskColumnProps[]>([]);
  const [tasks, setTasks] = useState<LinkedTaskProps[]>([])
  const [subtasks, setSubtasks] = useState<string[]>([
    "Subtarefa 1: Assinar um documento gigantesco para comprar algo na rua",
    "Subtarefa 2: Fazer alguma coisa",
    "Subtarefa 3: Fazer alguma coisa",
  ]);

  /* ----> functions <---- */
  const moveColumn = useCallback((fromIndex: number, toIndex: number) => {

    console.log('indo')
    const updatedColumns = [...taskColumnsList];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    setTaskColumnsList(updatedColumns);

  }, [taskColumnsList]);

  /* ----> effects <---- */

  /* faz fetch na API para preencher as colunas de tarefas
  e as tarefas */
  useEffect(() => {
    const getTaskColumns = async () => {
      const response = await api.get('/api/task/column/list/');
      const columns: TaskColumnProps[] = response.data.results;
      setTaskColumnsList(columns.sort(
        (a, b) => a.position - b.position
      ));
    }
    const getTasks = async () => {
      const response = await api.get('/api/task/list/');
      setTasks(response.data.results);
    }
    getTaskColumns();
    getTasks();
  }, [])

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <Breadcrumb pageName="TaskKanban" />

        {/* <!-- Task Header Start --> */}
        <TaskHeader />
        {/* <!-- Task Header End --> */}

        {/* <!-- Task List Wrapper Start --> */}
        <DndProvider backend={HTML5Backend}>
          <div className="mt-9 grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
            {/* <!-- Todo list --> */}
            {taskColumnsList.map((column: TaskColumnProps, index: number) => {

              const tasksRelated = tasks.filter(task => task.related_table_id === column.id);

              return (
                <TaskColumns id={column.id} index={index} column={column} tasksRelated={tasksRelated} subtasks={subtasks} moveColumn={moveColumn} type="column" />
              )
            })}
          </div>
        </DndProvider>
        {/* <!-- Task List Wrapper End --> */}
      </div>
    </>
  );
};

export default TaskKanban;

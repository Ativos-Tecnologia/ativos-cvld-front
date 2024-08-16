import React from "react";
import TaskKanban from "@/components/Tasks/KanbanTasks";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "CelerApp - Kanban",
};

const TaskKanbanPage = () => {
  return (
    <DefaultLayout>
      <TaskKanban />
    </DefaultLayout>
  );
};

export default TaskKanbanPage;

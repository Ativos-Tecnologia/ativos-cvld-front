import React from "react";
import { Metadata } from "next";
import TaskList from "@/components/Tasks/ListTasks";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const TaskListPage = () => {
  return (
    <DefaultLayout>
      <TaskList />
    </DefaultLayout>
  );
};

export default TaskListPage;

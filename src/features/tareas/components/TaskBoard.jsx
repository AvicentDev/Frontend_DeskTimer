"use client";
import { useState } from "react";
import ProjectList from "./ProjectList";
import TaskSidebar from "../utils/TaskSidebar";

export default function TaskBoard({ projects, tasks, onUpdateTask, onDeleteTask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allTasks, setAllTasks] = useState(tasks || []);

  // Selecciona una tarea y abre el sidebar
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  // Cierra el sidebar y deselecciona la tarea
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedTask(null);
  };

  // Actualiza la tarea en el estado local y llama a la función pasada por props
  const handleUpdateTaskLocal = (updatedTask) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setAllTasks(updatedTasks);
    setSelectedTask(updatedTask);
    if (onUpdateTask) onUpdateTask(updatedTask);
    setIsSidebarOpen(false);
  };

  // Elimina la tarea en el estado local y llama a la función pasada por props
  const handleDeleteTaskLocal = (taskId) => {
    const updatedTasks = allTasks.filter((task) => task.id !== taskId);
    setAllTasks(updatedTasks);
    setSelectedTask(null);
    if (onDeleteTask) onDeleteTask(taskId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative p-6">
      <ProjectList
        projects={projects}
        tasks={allTasks}
        onSelectTask={handleSelectTask}
      />

      <TaskSidebar
        task={selectedTask}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onUpdate={handleUpdateTaskLocal}
        onDelete={handleDeleteTaskLocal}
      />
    </div>
  );
}

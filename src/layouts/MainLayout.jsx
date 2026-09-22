import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import AppBackground from '../components/AppBackground';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] flex relative overflow-x-hidden selection:bg-[#DDD6FE] selection:text-[#0F172A]">
      {/* SaaS Pastel Background: Lavender, Peach, Cream & Curves */}
      <AppBackground variant="dashboard" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          onOpenNewTaskModal={handleOpenNewTask} 
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenNewTask: handleOpenNewTask, onEditTask: handleEditTask }} />
        </main>
      </div>

      {/* Reusable Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default MainLayout;

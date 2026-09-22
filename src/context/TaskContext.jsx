import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/client';
import { useToast } from './ToastContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    priority: 'All',
    status: 'All',
    riskLevel: 'All',
    search: '',
  });

  const { success, error: toastError } = useToast();

  const fetchTasks = useCallback(async (customFilters = null) => {
    setLoading(true);
    try {
      const activeFilters = customFilters || filters;
      const params = {};
      if (activeFilters.category && activeFilters.category !== 'All') params.category = activeFilters.category;
      if (activeFilters.priority && activeFilters.priority !== 'All') params.priority = activeFilters.priority;
      if (activeFilters.status && activeFilters.status !== 'All') params.status = activeFilters.status;
      if (activeFilters.riskLevel && activeFilters.riskLevel !== 'All') params.risk_level = activeFilters.riskLevel;
      if (activeFilters.search) params.search = activeFilters.search;

      const res = await api.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      toastError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters, toastError]);

  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks((prev) => [res.data, ...prev]);
      success('Task created successfully!');
      return { success: true, task: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create task.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, taskData);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      success('Task updated successfully!');
      return { success: true, task: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update task.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      success('Task deleted successfully.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete task.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const toggleTaskComplete = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/complete`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
      const isCompleted = res.data.completion_status === 'Completed';
      success(isCompleted ? 'Task marked as completed! 🎉' : 'Task restored to pending.');
      return { success: true, task: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to toggle status.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  // Subtask management
  const addSubtask = async (taskId, subtaskData) => {
    try {
      const res = await api.post(`/tasks/${taskId}/subtasks`, subtaskData);
      // Refresh task to get updated progress & subtask list
      const taskRes = await api.get(`/tasks/${taskId}`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? taskRes.data : t)));
      success('Subtask added.');
      return { success: true, subtask: res.data, task: taskRes.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add subtask.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const updateSubtask = async (taskId, subtaskId, subtaskData) => {
    try {
      await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
      const taskRes = await api.get(`/tasks/${taskId}`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? taskRes.data : t)));
      return { success: true, task: taskRes.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update subtask.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
      const taskRes = await api.get(`/tasks/${taskId}`);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? taskRes.data : t)));
      success('Subtask removed.');
      return { success: true, task: taskRes.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete subtask.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  // AI Helper Services
  const prioritizeWithAI = async (taskPayload) => {
    try {
      const res = await api.post('/ai/prioritize', taskPayload);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'AI prioritization error.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const breakdownWithAI = async (payload) => {
    try {
      const res = await api.post('/ai/breakdown', payload);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'AI breakdown error.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  const evaluateRiskWithAI = async (payload) => {
    try {
      const res = await api.post('/ai/deadline-risk', payload);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Deadline risk evaluation error.';
      toastError(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        filters,
        setFilters,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        prioritizeWithAI,
        breakdownWithAI,
        evaluateRiskWithAI,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

import { useState, useEffect } from 'react';
import { TicketTask } from '../types/gotit';

interface UseTaskManagerProps {
  onTicketClosed?: (task: TicketTask) => void;
}

export function useTaskManager({ onTicketClosed }: UseTaskManagerProps = {}) {
  const [tasks, setTasks] = useState<TicketTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Carga Híbrida (Failover a localStorage)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // TODO: conectar con supabase.from('tickets') cuando la tabla exista
        throw new Error('Supabase tickets not yet configured');
      } catch {
        const storedTasks = localStorage.getItem('gotit_tickets');
        if (storedTasks) {
          try {
            setTasks(JSON.parse(storedTasks));
          } catch (e) {
            console.error("Error parseando tickets locales", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 2. Persistencia
  const saveTasks = async (newTasks: TicketTask[], syncWithCloud = false) => {
    // Memoria volátil
    setTasks(newTasks);
    // Persistencia Local
    localStorage.setItem('gotit_tickets', JSON.stringify(newTasks));

    // Pipeline para el futuro
    if (syncWithCloud) {
      // TODO: upsert en Supabase cuando la tabla tickets exista
    }
  };

  /** Métodos Core CRUD */

  const createTask = (title: string, description: string, dueDate: string, priority: TicketTask['priority']) => {
    if (!title.trim() || !dueDate.trim()) return;

    const newTask: TicketTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority
    };

    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: number, title: string, description: string, dueDate: string, priority: TicketTask['priority']) => {
    if (!title.trim() || !dueDate.trim()) return;

    const newTasks = tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          title: title.trim(),
          description: description.trim(),
          dueDate,
          priority
        };
      }
      return t;
    });

    saveTasks(newTasks);
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete && onTicketClosed) {
      // Disparador de Gamificación para hacer crecer las plantas
      onTicketClosed(taskToDelete); 
    }
    const filteredTasks = tasks.filter(t => t.id !== id);
    saveTasks(filteredTasks);
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask
  };
}

import React, { useState } from 'react';
import { useTaskManager } from '../../hooks/useTaskManager';
import { TicketForm } from './TicketForm';
import { TicketCard } from './TicketCard';
import { TicketTask, Priority } from '../../types/gotit';
import { CheckCircle2, Sprout } from 'lucide-react';
import PageTransition from "@/components/PageTransition";

export const TicketDashboard: React.FC = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTaskManager({
    onTicketClosed: (task) => {
      console.log(`🌱 [Gamificación] ¡Ticket Cerrado! Otorgando +10 XP al usuario. Obligación mitigada: "${task.title}".`);
    }
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const taskToEdit = editingId ? tasks.find(t => t.id === editingId) || null : null;

  const handleFormSubmit = (title: string, desc: string, date: string, priority: Priority) => {
    if (editingId) {
      updateTask(editingId, title, desc, date, priority);
      setEditingId(null);
    } else {
      createTask(title, desc, date, priority);
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    if (editingId === id) setEditingId(null);
  };

  if (isLoading) {
    return <div className="p-8 text-neutral-400 text-center">Cargando tickets operativos...</div>;
  }

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <PageTransition>
      <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          
          <header className="mb-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm" style={{ background: "color-mix(in srgb, var(--leaf-fresh) 20%, transparent)" }}>
              <Sprout className="h-8 w-8" style={{ color: "var(--leaf-bright)" }} />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-black md:text-4xl" style={{ color: "var(--forest-deep)" }}>
                Got It Tickets
              </h1>
              <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-warm)" }}>
                Centro de control de obligaciones operativas. Transforma tareas en energía para tu jardín.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
            <div className="lg:sticky lg:top-8 z-10 w-full shadow-lg rounded-[2rem]">
              <TicketForm 
                taskToEdit={taskToEdit} 
                onSubmit={handleFormSubmit}
                onCancelEdit={() => setEditingId(null)}
              />
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-heading font-bold pb-2 flex items-center gap-2 border-b" style={{ borderColor: 'var(--border-soft)', color: 'var(--forest-deep)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                Operaciones Activas <span style={{ color: "var(--leaf-muted)" }} className="ml-2 text-sm font-normal">({tasks.length})</span>
              </h2>

              {tasks.length === 0 ? (
                <div className="organic-card flex flex-col items-center justify-center p-12 text-center shadow-sm">
                  <CheckCircle2 size={56} strokeWidth={1} style={{ color: "var(--leaf-bright)", opacity: 0.8 }} className="mb-4 drop-shadow-sm" />
                  <h3 className="font-heading text-xl font-bold" style={{ color: "var(--forest-deep)" }}>Todo reluciente</h3>
                  <p className="text-sm mt-1 max-w-sm" style={{ color: "var(--text-warm)" }}>
                    El tablero está vacío. Has mitigado todos los riesgos por ahora. El ecosistema está en perfecto equilibrio orgánico.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                  {sortedTasks.map(task => (
                    <TicketCard 
                      key={task.id} 
                      task={task} 
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

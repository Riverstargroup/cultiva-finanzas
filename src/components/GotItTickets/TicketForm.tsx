import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Pencil } from 'lucide-react';
import { TicketTask, Priority } from '../../../types/gotit';

interface TicketFormProps {
  taskToEdit: TicketTask | null;
  onSubmit: (title: string, desc: string, date: string, priority: Priority) => void;
  onCancelEdit: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ taskToEdit, onSubmit, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Media');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
    } else {
      handleReset();
    }
  }, [taskToEdit]);

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Media');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate.trim()) return;

    onSubmit(title, description, dueDate, priority);
    if (!taskToEdit) {
      handleReset();
    }
  };

  const isEditing = !!taskToEdit;

  return (
    <aside className="organic-card p-6 md:p-8 transition-all duration-300 relative overflow-hidden" 
      style={isEditing ? { border: '2px solid var(--leaf-bright)', boxShadow: '0 10px 40px -10px color-mix(in srgb, var(--leaf-fresh) 40%, transparent)' } : {}}>
      
      {/* Detalle visual superior */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: isEditing ? "var(--terracotta-vivid)" : "var(--leaf-bright)" }}></div>

      <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 border-b pb-4" style={{ color: "var(--forest-deep)", borderColor: 'var(--border-soft)' }}>
        {isEditing ? <><Pencil size={20} style={{ color: "var(--terracotta-vivid)" }} /> Editando obligación</> : <><PlusCircle size={20} style={{ color: "var(--leaf-bright)" }} /> Nuevo Ticket</>}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] uppercase tracking-wider font-bold" style={{ color: "var(--leaf-muted)" }}>Título *</label>
          <input 
            type="text" required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Ej. Pagar servicios, Auditar base..."
            className="w-full rounded-[14px] px-4 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white"
            style={{ color: "var(--forest-deep)", outlineColor: "var(--leaf-fresh)" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] uppercase tracking-wider font-bold" style={{ color: "var(--leaf-muted)" }}>Detalles</label>
          <textarea 
            rows={3} value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Información, enlaces..."
            className="w-full rounded-[14px] px-4 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white resize-y"
            style={{ color: "var(--forest-deep)", outlineColor: "var(--leaf-fresh)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] uppercase tracking-wider font-bold" style={{ color: "var(--leaf-muted)" }}>Límite *</label>
            <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-[14px] px-3 md:px-4 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white"
              style={{ color: "var(--forest-deep)", outlineColor: "var(--leaf-fresh)" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] uppercase tracking-wider font-bold" style={{ color: "var(--leaf-muted)" }}>Prioridad</label>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
              className="w-full rounded-[14px] px-3 md:px-4 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white font-medium"
              style={{ color: "var(--forest-deep)", outlineColor: "var(--leaf-fresh)" }}
            >
              <option value="Baja">🟢 Baja</option>
              <option value="Media">🟠 Media</option>
              <option value="Alta">🔴 Alta</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button type="submit" className="vibrant-btn w-full justify-center h-14 text-base shadow-[0_5px_20px_-5px_rgba(20,83,45,0.3)]">
            {isEditing ? <><Save size={18} /> Guardar Cambios</> : <><PlusCircle size={18} /> Anotar Obligación</>}
          </button>
          {isEditing && (
            <button type="button" onClick={onCancelEdit}
              className="w-full rounded-full py-3 text-sm font-bold transition-colors hover:bg-gray-100 mt-2"
              style={{ color: "var(--text-warm)" }}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </aside>
  );
};

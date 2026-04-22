import React from 'react';
import { Pencil, Trash2, Calendar, Hash } from 'lucide-react';
import { TicketTask } from '../../../types/gotit';

interface TicketCardProps {
  task: TicketTask;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ task, onEdit, onDelete }) => {
  const dateObj = new Date(task.dueDate + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  // Styles ajustados al modo claro organico
  const badgeStyles: Record<string, string> = {
    Alta: 'bg-red-50 text-red-600 border-red-200',
    Media: 'bg-orange-50 text-orange-600 border-orange-200',
    Baja: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  return (
    <div className="organic-card flex flex-col gap-3 p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl relative border" style={{ borderColor: 'transparent' }}>
      
      <div className="absolute top-4 right-4 flex gap-0.5 items-center bg-white/50 backdrop-blur-sm rounded-full p-0.5 border border-gray-100 shadow-sm z-10">
        <button onClick={() => onEdit(task.id)} className="p-1.5 rounded-full transition-colors hover:bg-gray-100 text-gray-400 hover:text-gray-800" title="Editar">
          <Pencil size={15} />
        </button>
        <button onClick={() => { if (window.confirm("¿Estás seguro de eliminar o cerrar este ticket?")) onDelete(task.id); }} 
          className="p-1.5 rounded-full transition-colors hover:bg-red-50 text-gray-400 hover:text-red-500" title="Eliminar">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="flex justify-between items-start pt-1">
        <h3 className="font-heading text-lg font-bold pr-16 leading-tight" style={{ color: "var(--forest-deep)" }}>
          {task.title}
        </h3>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-warm)", minHeight: '2.5rem' }}>
        {task.description || <span className="italic opacity-60">Sin descripción extra...</span>}
      </p>

      <div className="flex justify-between items-center mt-3 pt-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--leaf-muted)" }}>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <Hash size={13} />
            <span>{task.id.toString().slice(-5)}</span>
          </div>
        </div>
        <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-[0.1em] rounded-md border ${badgeStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};

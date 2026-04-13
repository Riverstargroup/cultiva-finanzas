export type Priority = 'Baja' | 'Media' | 'Alta';

export interface TicketTask {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
}

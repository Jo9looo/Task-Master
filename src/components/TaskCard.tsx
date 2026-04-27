"use client";
import { motion } from "framer-motion";
import { Check, Trash2, Clock, Calendar as CalendarIcon } from "lucide-react";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  due_date?: string | null;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-secondary/20 text-secondary border-secondary/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  high: "bg-danger/20 text-danger border-danger/30",
};

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={`glass-panel group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        task.completed ? "opacity-50 grayscale-[0.5]" : ""
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
          task.completed
            ? "bg-success border-success text-background"
            : "border-foreground/30 text-transparent hover:border-primary"
        }`}
      >
        <Check className="w-4 h-4" strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-base font-medium truncate transition-all ${
            task.completed ? "line-through text-foreground/50" : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
          <span
            className={`px-2 py-0.5 rounded-md border font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority.toUpperCase()}
          </span>
          
          {task.due_date && (
            <span className="flex items-center gap-1 text-warning font-medium bg-warning/10 px-2 py-0.5 rounded-md">
              <CalendarIcon className="w-3 h-3" />
              {new Date(task.due_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          <span className="flex items-center gap-1 text-foreground/40">
            <Clock className="w-3 h-3" />
            {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 text-danger/70 hover:text-danger hover:bg-danger/10 rounded-xl transition-all cursor-pointer"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

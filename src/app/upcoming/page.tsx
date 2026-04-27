"use client";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import TaskCard from "@/components/TaskCard";
import TaskInput from "@/components/TaskInput";
import { useStore } from "@/store/useStore";
import { Loader2 } from "lucide-react";

export default function UpcomingPage() {
  const { tasks, user, loading, fetchInitialData, addTask, toggleTask, deleteTask } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-foreground/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      </div>
    );
  }

  if (!user) return null;

  // Filter tasks that have a due date in the future
  const upcomingTasks = tasks.filter(t => t.due_date && new Date(t.due_date).getTime() >= new Date().setHours(0,0,0,0));
  
  // Sort by closest due date first
  upcomingTasks.sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  const activeTasks = upcomingTasks.filter(t => !t.completed);
  const completedTasks = upcomingTasks.filter(t => t.completed);

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          Upcoming
        </h1>
      </header>
      
      <main>
        <TaskInput onAdd={(title, priority, dueDate) => addTask(title, priority, dueDate)} />

        <div className="space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-foreground/80 mb-4 flex items-center gap-2">
              Scheduled Tasks
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-md">
                {activeTasks.length}
              </span>
            </h2>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {activeTasks.length === 0 ? (
                  <div className="text-center py-12 glass-panel rounded-2xl border-dashed">
                    <p className="text-foreground/40">No upcoming tasks scheduled.</p>
                  </div>
                ) : (
                  activeTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onToggle={(id) => toggleTask(id, task.completed)} 
                      onDelete={deleteTask} 
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground/50 mb-4 flex items-center gap-2">
                Completed
              </h2>
              <div className="space-y-3 opacity-80">
                <AnimatePresence mode="popLayout">
                  {completedTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onToggle={(id) => toggleTask(id, task.completed)} 
                      onDelete={deleteTask} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

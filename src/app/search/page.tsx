"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import TaskCard from "@/components/TaskCard";
import { useStore } from "@/store/useStore";
import { Loader2, Search } from "lucide-react";

export default function SearchPage() {
  const { tasks, user, loading, fetchInitialData, toggleTask, deleteTask } = useStore();
  const [query, setQuery] = useState("");

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

  const filteredTasks = tasks.filter(t => 
    query.trim() === "" ? false : t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          Search
        </h1>
      </header>
      
      <main>
        <div className="glass-panel p-2 rounded-2xl flex items-center gap-3 mb-10">
          <Search className="w-5 h-5 text-foreground/50 ml-4" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 bg-transparent border-none outline-none pr-4 text-foreground h-12"
          />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {query.trim() === "" ? (
              <div className="text-center py-12">
                <p className="text-foreground/40">Start typing to search for tasks</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12 glass-panel rounded-2xl border-dashed">
                <p className="text-foreground/40">No tasks found matching "{query}"</p>
              </div>
            ) : (
              filteredTasks.map(task => (
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
      </main>
    </div>
  );
}

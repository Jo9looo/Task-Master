"use client";
import { useState } from "react";
import { Plus, Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { Priority } from "./TaskCard";
import { AnimatePresence, motion } from "framer-motion";

interface TaskInputProps {
  onAdd: (title: string, priority: Priority, dueDate?: string) => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    let combinedDateTime = undefined;
    if (dueDate) {
      combinedDateTime = `${dueDate}T${dueTime || "23:59"}:00`;
    }

    onAdd(title.trim(), priority, combinedDateTime);
    setTitle("");
    setDueDate("");
    setDueTime("");
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDueDate(today);
    setDueTime("23:59");
  };

  const handleSetTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow.toISOString().split('T')[0]);
    setDueTime("23:59");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 mb-8 relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 w-full bg-transparent border-none outline-none px-4 text-foreground placeholder:text-foreground/30 h-12"
        />
        
        <div className="flex items-center gap-2 px-3 py-2 sm:py-0 border-t sm:border-t-0 sm:border-l border-card-border w-full sm:w-auto justify-center sm:justify-start">
          
          {/* Custom Date Picker Trigger */}
          <button 
            type="button" 
            onClick={() => setIsDateModalOpen(true)}
            className={`px-3 h-8 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${dueDate ? 'text-warning bg-warning/10 font-medium' : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5'}`}
            title="Set Deadline"
          >
            <CalendarIcon className="w-4 h-4" />
            {dueDate && <span className="text-xs">{new Date(dueDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>}
          </button>

          <div className="w-px h-6 bg-card-border mx-1 hidden sm:block"></div>

          {/* Priority Picker */}
          {(["low", "medium", "high"] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                priority === p 
                  ? p === "low" ? "bg-secondary text-background" : p === "medium" ? "bg-warning text-background" : "bg-danger text-background"
                  : "text-foreground/30 hover:bg-foreground/5"
              }`}
              title={`Priority: ${p}`}
            >
              {p[0].toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="h-12 w-full sm:w-auto px-6 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span className="inline">Add Task</span>
        </button>
      </form>

      {/* Beautiful Date Time Picker Modal */}
      <AnimatePresence>
        {isDateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-card-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-warning" />
                  Set Deadline
                </h3>
                <button onClick={() => setIsDateModalOpen(false)} className="text-foreground/40 hover:text-foreground p-1 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Date Input */}
                <div>
                  <label className="block text-xs font-medium text-foreground/50 mb-2 uppercase tracking-wider">Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 outline-none focus:border-warning transition-colors text-foreground cursor-pointer appearance-none"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-xs font-medium text-foreground/50 mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time (Optional)
                  </label>
                  <input 
                    type="time" 
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 outline-none focus:border-warning transition-colors text-foreground cursor-pointer appearance-none"
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSetToday} className="flex-1 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-sm font-medium text-foreground/70 transition-colors">
                    Today
                  </button>
                  <button onClick={handleSetTomorrow} className="flex-1 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-sm font-medium text-foreground/70 transition-colors">
                    Tomorrow
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-card-border">
                  <button
                    type="button"
                    onClick={() => { setDueDate(""); setDueTime(""); setIsDateModalOpen(false); }}
                    className="flex-1 py-3 rounded-xl text-danger hover:bg-danger/10 transition-colors font-medium cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDateModalOpen(false)}
                    className="flex-[2] py-3 rounded-xl bg-warning text-white font-medium hover:bg-warning/90 transition-colors cursor-pointer shadow-lg shadow-warning/20"
                  >
                    Save Deadline
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

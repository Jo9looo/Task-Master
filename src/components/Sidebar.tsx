"use client";
import { useState } from "react";
import { 
  Search, 
  Inbox, 
  Calendar, 
  CalendarDays, 
  Hash, 
  LogOut,
  FolderPlus
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function Sidebar() {
  const { user, projects, addProject, signOut } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const colors = ["#8b5cf6", "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#ec4899"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addProject(newProjectName.trim(), randomColor);
      setNewProjectName("");
      setIsProjectModalOpen(false);
    }
  };

  // Get username from metadata, fallback to email prefix
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <aside className="w-64 glass-panel border-y-0 border-l-0 rounded-none h-full flex flex-col pt-6 flex-shrink-0">
        {/* User Profile Area */}
        <Link href="/profile" className="px-6 mb-8 flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{displayName}</p>
          </div>
        </Link>

        {/* Main Menu */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <Link href="/search" className={pathname === "/search" ? "w-full flex items-center gap-3 px-3 py-2 bg-foreground/10 text-foreground rounded-xl transition-colors font-medium cursor-pointer" : "w-full flex items-center gap-3 px-3 py-2 text-foreground/70 hover:bg-foreground/10 rounded-xl transition-colors cursor-pointer"}>
            <Search className="w-5 h-5" />
            Search
          </Link>
          <Link href="/" className={pathname === "/" ? "w-full flex items-center gap-3 px-3 py-2 bg-foreground/10 text-foreground rounded-xl transition-colors font-medium cursor-pointer" : "w-full flex items-center gap-3 px-3 py-2 text-foreground/70 hover:bg-foreground/10 rounded-xl transition-colors cursor-pointer"}>
            <Calendar className="w-5 h-5 text-warning" />
            General Tasks
          </Link>
          <Link href="/upcoming" className={pathname === "/upcoming" ? "w-full flex items-center gap-3 px-3 py-2 bg-foreground/10 text-foreground rounded-xl transition-colors font-medium cursor-pointer" : "w-full flex items-center gap-3 px-3 py-2 text-foreground/70 hover:bg-foreground/10 rounded-xl transition-colors cursor-pointer"}>
            <CalendarDays className="w-5 h-5 text-primary" />
            Upcoming
          </Link>
          
          <div className="pt-8 pb-3 px-3 flex items-center justify-between group">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">My Projects</h3>
            <button 
              onClick={() => setIsProjectModalOpen(true)} 
              className="text-foreground/40 hover:text-primary transition-colors cursor-pointer" 
              title="Add Project"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
          
          {projects.map(project => {
            const isActive = pathname === `/project/${project.id}`;
            return (
              <Link key={project.id} href={`/project/${project.id}`} className={isActive ? "w-full flex items-center gap-3 px-3 py-2 bg-foreground/10 text-foreground rounded-xl transition-colors font-medium cursor-pointer" : "w-full flex items-center gap-3 px-3 py-2 text-foreground/70 hover:bg-foreground/10 rounded-xl transition-colors cursor-pointer"}>
                <Hash className="w-5 h-5" style={{ color: project.color_accent }} />
                <span className="truncate">{project.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto border-t border-card-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-foreground/50 hover:text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Project Creation Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-card-border"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground">New Project</h3>
              <form onSubmit={handleAddProject}>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g., Belajar Coding"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors mb-6 text-foreground"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-foreground/70 hover:bg-foreground/10 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newProjectName.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

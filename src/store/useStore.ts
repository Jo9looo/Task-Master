import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { Task, Priority } from '@/components/TaskCard';

export interface Project {
  id: string;
  name: string;
  color_accent: string;
}

interface AppState {
  tasks: Task[];
  projects: Project[];
  user: any;
  loading: boolean;
  
  setUser: (user: any) => void;
  fetchInitialData: () => Promise<void>;
  addTask: (title: string, priority: Priority, due_date?: string, project_id?: string) => Promise<void>;
  toggleTask: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addProject: (name: string, color?: string) => Promise<void>;
  updateUsername: (newUsername: string) => Promise<boolean>;
  deleteAccount: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => {
  const supabase = createClient();
  
  return {
    tasks: [],
    projects: [],
    user: null,
    loading: true,

    setUser: (user) => set({ user }),

    fetchInitialData: async () => {
      set({ loading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, loading: false });
        return;
      }
      
      set({ user: session.user });

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });
        
      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      set({ 
        projects: projectsData || [], 
        tasks: (tasksData || []).map(t => ({
          ...t,
          createdAt: new Date(t.created_at).getTime()
        })),
        loading: false 
      });
    },

    addTask: async (title, priority, due_date, project_id) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const newTask = {
        user_id: session.user.id,
        title,
        priority,
        project_id: project_id || null,
        due_date: due_date || null,
        completed: false
      };

      // Optimistic update
      const tempId = crypto.randomUUID();
      const optimisticTask: Task = {
        id: tempId,
        title,
        completed: false,
        priority,
        createdAt: Date.now(),
        due_date: due_date || null
      };
      
      set((state) => ({ tasks: [optimisticTask, ...state.tasks] }));

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (!error && data) {
        set((state) => ({ 
          tasks: state.tasks.map(t => t.id === tempId ? {
            ...data,
            createdAt: new Date(data.created_at).getTime()
          } : t)
        }));
      }
    },

    toggleTask: async (id, currentStatus) => {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t)
      }));

      await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', id);
    },

    deleteTask: async (id) => {
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      }));

      await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
    },

    addProject: async (name, color = '#8b5cf6') => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('projects')
        .insert([{ user_id: session.user.id, name, color_accent: color }])
        .select()
        .single();

      if (!error && data) {
        set((state) => ({ projects: [...state.projects, data] }));
      }
    },

    updateUsername: async (newUsername) => {
      const { data, error } = await supabase.auth.updateUser({
        data: { username: newUsername }
      });
      if (!error && data.user) {
        set({ user: data.user });
        return true;
      }
      return false;
    },

    deleteAccount: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Wipe user data
      await supabase.from('tasks').delete().eq('user_id', session.user.id);
      await supabase.from('projects').delete().eq('user_id', session.user.id);
      
      // Sign out
      await supabase.auth.signOut();
      set({ user: null, tasks: [], projects: [] });
      // Note: Actual account deletion in Supabase requires admin privileges. 
      // This wipes their data and logs them out as a functional equivalent for the frontend.
    },
    
    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, tasks: [], projects: [] });
    }
  };
});

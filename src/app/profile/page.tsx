"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Loader2, Edit2, Check, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading, fetchInitialData, signOut, updateUsername, deleteAccount } = useStore();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (user) {
      setNewUsername(user.user_metadata?.username || user.email?.split('@')[0]);
    }
  }, [user]);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) return;
    setIsUpdating(true);
    const success = await updateUsername(newUsername.trim());
    if (success) setIsEditing(false);
    setIsUpdating(false);
  };

  const handleDeleteAccount = async () => {
    setIsUpdating(true);
    await deleteAccount();
    router.push('/register');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          Profile Settings
        </h1>
      </header>
      
      <main className="glass-panel p-8 rounded-3xl max-w-xl">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-card-border">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-4xl shadow-xl flex-shrink-0">
            {user.user_metadata?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  autoFocus
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-background/50 border border-primary rounded-lg px-3 py-1 outline-none text-xl font-bold text-foreground w-full"
                />
                <button onClick={handleSaveUsername} disabled={isUpdating} className="p-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-foreground truncate">{user.user_metadata?.username || 'User'}</h2>
                <button onClick={() => setIsEditing(true)} className="p-1.5 text-foreground/40 hover:text-primary bg-foreground/5 hover:bg-primary/10 rounded-md transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-foreground/50 truncate">{user.email}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Account ID</label>
            <input type="text" readOnly value={user.id} className="w-full bg-background/30 border border-card-border rounded-xl px-4 py-3 text-foreground/40 font-mono text-sm outline-none" />
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button onClick={handleSignOut} className="flex-1 px-6 py-3 bg-foreground/5 text-foreground hover:bg-foreground/10 rounded-xl font-medium transition-colors cursor-pointer text-center">
              Sign Out
            </button>
            
            {showDeleteConfirm ? (
              <div className="flex-1 flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-3 bg-foreground/5 text-foreground rounded-xl text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} disabled={isUpdating} className="flex-[2] px-4 py-3 bg-danger text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Delete"}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)} className="flex-1 px-6 py-3 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </button>
            )}
          </div>
          
          {showDeleteConfirm && (
             <div className="mt-4 p-4 bg-danger/10 border border-danger/30 rounded-xl flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
               <p className="text-sm text-danger/90">
                 Warning: This action will permanently delete all your tasks and projects. This cannot be undone.
               </p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

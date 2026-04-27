import { CheckSquare } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 mb-8 flex items-center justify-between rounded-2xl mt-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-xl">
          <CheckSquare className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Task<span className="text-primary">Master</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-foreground/60 font-medium">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </nav>
  );
}

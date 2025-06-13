import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  RefreshCcw, 
  BarChart3,
  Settings,
  LogOut,
  StickyNote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export const Sidebar = ({ activeModule, setActiveModule }: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "members", label: "Members", icon: Users },
    { id: "circulation", label: "Circulation", icon: RefreshCcw },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "notes", label: "Notes & Reminders", icon: StickyNote },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border shadow-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">LibraryMS</h1>
            <p className="text-xs text-muted-foreground">Welcome, {user?.name}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeModule === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-11"
              onClick={() => setActiveModule(item.id)}
            >
              <IconComponent className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-11"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

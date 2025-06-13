
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { BookManagement } from "@/components/BookManagement";
import { MemberManagement } from "@/components/MemberManagement";
import { CirculationSystem } from "@/components/CirculationSystem";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";
import { NotesReminders } from "@/components/NotesReminders";
import { AuthForm } from "@/components/auth/AuthForm";
import { InstitutionHeader } from "@/components/InstitutionHeader";
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const { isAuthenticated } = useAuth();

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "books":
        return <BookManagement />;
      case "members":
        return <MemberManagement />;
      case "circulation":
        return <CirculationSystem />;
      case "reports":
        return <Reports />;
      case "notes":
        return <NotesReminders />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 ml-64">
        <InstitutionHeader />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveModule()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

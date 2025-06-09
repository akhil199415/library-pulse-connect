
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { BookManagement } from "@/components/BookManagement";
import { MemberManagement } from "@/components/MemberManagement";
import { CirculationSystem } from "@/components/CirculationSystem";
import { Reports } from "@/components/Reports";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";

const MainApp = () => {
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
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default Index;

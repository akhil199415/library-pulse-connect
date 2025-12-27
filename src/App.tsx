
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/auth/AuthProvider";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;

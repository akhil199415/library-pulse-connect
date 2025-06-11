
import { useAuth } from "@/components/auth/AuthProvider";
import { useSettings } from "@/contexts/SettingsContext";

export const InstitutionHeader = () => {
  const { user } = useAuth();
  const { institutionLogo } = useSettings();

  if (!user) return null;

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {institutionLogo && (
          <img 
            src={institutionLogo} 
            alt={`${user.institutionName} Logo`} 
            className="w-12 h-12 object-contain"
          />
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.institutionName}</h1>
          <p className="text-sm text-gray-600">{user.institutionType}</p>
        </div>
      </div>
    </div>
  );
};


import { useAuth } from "@/components/auth/AuthProvider";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const InstitutionHeader = () => {
  const { user } = useAuth();
  const { institutionLogo, setInstitutionLogo } = useSettings();

  if (!user) return null;

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInstitutionLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative group">
          {institutionLogo ? (
            <img 
              src={institutionLogo} 
              alt={`${user.institutionName} Logo`} 
              className="w-12 h-12 object-contain rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.institutionName}</h1>
          <p className="text-sm text-gray-600">{user.institutionType}</p>
        </div>
      </div>
    </div>
  );
};

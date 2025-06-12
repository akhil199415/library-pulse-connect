
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfigItem {
  id: string;
  name: string;
}

interface SettingsContextType {
  // School settings
  classes: ConfigItem[];
  setClasses: (classes: ConfigItem[]) => void;
  divisions: ConfigItem[];
  setDivisions: (divisions: ConfigItem[]) => void;
  streams: ConfigItem[];
  setStreams: (streams: ConfigItem[]) => void;
  
  // College settings
  courses: ConfigItem[];
  setCourses: (courses: ConfigItem[]) => void;
  yearSemesters: ConfigItem[];
  setYearSemesters: (yearSemesters: ConfigItem[]) => void;
  subjects: ConfigItem[];
  setSubjects: (subjects: ConfigItem[]) => void;
  
  // General settings
  designations: ConfigItem[];
  setDesignations: (designations: ConfigItem[]) => void;
  genres: ConfigItem[];
  setGenres: (genres: ConfigItem[]) => void;
  institutionLogo: string;
  setInstitutionLogo: (logo: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // School settings with default values
  const [classes, setClasses] = useState<ConfigItem[]>([
    { id: "1", name: "I" },
    { id: "2", name: "II" },
    { id: "3", name: "III" },
    { id: "4", name: "IV" },
    { id: "5", name: "V" },
    { id: "6", name: "VI" },
    { id: "7", name: "VII" },
    { id: "8", name: "VIII" },
    { id: "9", name: "IX" },
    { id: "10", name: "X" },
    { id: "11", name: "XI" },
    { id: "12", name: "XII" }
  ]);
  
  const [divisions, setDivisions] = useState<ConfigItem[]>([
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" },
    { id: "4", name: "D" }
  ]);

  const [streams, setStreams] = useState<ConfigItem[]>([
    { id: "1", name: "Science" },
    { id: "2", name: "Commerce" },
    { id: "3", name: "Arts" },
    { id: "4", name: "Humanities" }
  ]);

  // College settings with default values
  const [courses, setCourses] = useState<ConfigItem[]>([
    { id: "1", name: "B.Tech" },
    { id: "2", name: "MBA" },
    { id: "3", name: "BCA" },
    { id: "4", name: "MCA" },
    { id: "5", name: "B.Com" },
    { id: "6", name: "M.Com" }
  ]);

  const [yearSemesters, setYearSemesters] = useState<ConfigItem[]>([
    { id: "1", name: "1st Year" },
    { id: "2", name: "2nd Year" },
    { id: "3", name: "3rd Year" },
    { id: "4", name: "4th Year" },
    { id: "5", name: "1st Semester" },
    { id: "6", name: "2nd Semester" },
    { id: "7", name: "3rd Semester" },
    { id: "8", name: "4th Semester" }
  ]);

  const [subjects, setSubjects] = useState<ConfigItem[]>([
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Information Technology" },
    { id: "3", name: "Electronics" },
    { id: "4", name: "Mechanical" },
    { id: "5", name: "Civil" },
    { id: "6", name: "Finance" },
    { id: "7", name: "Marketing" }
  ]);

  // General settings
  const [designations, setDesignations] = useState<ConfigItem[]>([
    { id: "1", name: "Manager" },
    { id: "2", name: "Doctor" },
    { id: "3", name: "Nurse" },
    { id: "4", name: "Technician" },
    { id: "5", name: "Administrator" },
    { id: "6", name: "Clerk" },
    { id: "7", name: "Security" }
  ]);

  const [genres, setGenres] = useState<ConfigItem[]>([
    { id: "1", name: "Fiction" },
    { id: "2", name: "Non-Fiction" },
    { id: "3", name: "Science" },
    { id: "4", name: "History" },
    { id: "5", name: "Biography" },
    { id: "6", name: "Technology" },
    { id: "7", name: "Mathematics" },
    { id: "8", name: "Literature" }
  ]);

  const [institutionLogo, setInstitutionLogo] = useState<string>("");

  return (
    <SettingsContext.Provider value={{
      classes,
      setClasses,
      divisions,
      setDivisions,
      streams,
      setStreams,
      courses,
      setCourses,
      yearSemesters,
      setYearSemesters,
      subjects,
      setSubjects,
      designations,
      setDesignations,
      genres,
      setGenres,
      institutionLogo,
      setInstitutionLogo
    }}>
      {children}
    </SettingsContext.Provider>
  );
};


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSettings } from "@/contexts/SettingsContext";

interface ConfigItem {
  id: string;
  name: string;
}

export const Settings = () => {
  const { user } = useAuth();
  const isSchool = user?.institutionType === "School";
  const isCollege = user?.institutionType === "College";

  const {
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
  } = useSettings();

  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<ConfigItem | null>(null);

  const addItem = (items: ConfigItem[], setItems: (items: ConfigItem[]) => void) => {
    if (newItemName.trim()) {
      const newItem: ConfigItem = {
        id: Date.now().toString(),
        name: newItemName.trim()
      };
      setItems([...items, newItem]);
      setNewItemName("");
    }
  };

  const updateItem = (items: ConfigItem[], setItems: (items: ConfigItem[]) => void, updatedItem: ConfigItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  };

  const deleteItem = (items: ConfigItem[], setItems: (items: ConfigItem[]) => void, id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInstitutionLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ConfigSection = ({ 
    title, 
    items, 
    setItems 
  }: { 
    title: string; 
    items: ConfigItem[]; 
    setItems: (items: ConfigItem[]) => void;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={`Add new ${title.toLowerCase()}`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem(items, setItems)}
          />
          <Button onClick={() => addItem(items, setItems)} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 border rounded">
              {editingItem?.id === item.id ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && updateItem(items, setItems, editingItem)}
                  />
                  <Button size="sm" onClick={() => updateItem(items, setItems, editingItem)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span>{item.name}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditingItem(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteItem(items, setItems, item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      <p className="text-muted-foreground">{user?.institutionName} - {user?.institutionType}</p>

      {/* Institution Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Institution Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {institutionLogo && (
              <img src={institutionLogo} alt="Institution Logo" className="w-20 h-20 object-contain border rounded" />
            )}
            <div>
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" className="gap-2" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </span>
                </Button>
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Recommended size: 200x200 pixels, PNG or JPG format
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genres Configuration */}
      <ConfigSection title="Genres" items={genres} setItems={setGenres} />

      {isSchool && (
        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="divisions">Divisions</TabsTrigger>
            <TabsTrigger value="streams">Streams</TabsTrigger>
          </TabsList>
          <TabsContent value="classes">
            <ConfigSection title="Classes" items={classes} setItems={setClasses} />
          </TabsContent>
          <TabsContent value="divisions">
            <ConfigSection title="Divisions" items={divisions} setItems={setDivisions} />
          </TabsContent>
          <TabsContent value="streams">
            <ConfigSection title="Streams" items={streams} setItems={setStreams} />
          </TabsContent>
        </Tabs>
      )}

      {isCollege && (
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="years">Year/Semester</TabsTrigger>
            <TabsTrigger value="subjects">Subjects/Branches</TabsTrigger>
          </TabsList>
          <TabsContent value="courses">
            <ConfigSection title="Courses" items={courses} setItems={setCourses} />
          </TabsContent>
          <TabsContent value="years">
            <ConfigSection title="Year/Semester" items={yearSemesters} setItems={setYearSemesters} />
          </TabsContent>
          <TabsContent value="subjects">
            <ConfigSection title="Subjects/Branches" items={subjects} setItems={setSubjects} />
          </TabsContent>
        </Tabs>
      )}

      {!isSchool && !isCollege && (
        <ConfigSection title="Designations" items={designations} setItems={setDesignations} />
      )}
    </div>
  );
};

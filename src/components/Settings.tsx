
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={`Add new ${title.toLowerCase()}`}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem(items, setItems)}
          className="flex-1"
        />
        <Button onClick={() => addItem(items, setItems)} size="sm" className="px-4">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
            {editingItem?.id === item.id ? (
              <div className="flex gap-2 flex-1">
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && updateItem(items, setItems, editingItem)}
                  className="flex-1"
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
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditingItem(item)} className="h-8 w-8 p-0">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteItem(items, setItems, item.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">{user?.institutionName} - {user?.institutionType}</p>
      </div>

      {/* Institution Logo Upload */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Institution Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {institutionLogo && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <img src={institutionLogo} alt="Institution Logo" className="w-24 h-24 object-contain" />
              </div>
            )}
            <div className="flex-1">
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
                Recommended: 200x200 pixels, PNG or JPG format
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Genres Configuration */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Book Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-lg font-semibold mb-4">Book Genres</h3>
            <ConfigSection title="Genres" items={genres} setItems={setGenres} />
          </div>
        </CardContent>
      </Card>

      {/* Academic Institution Settings */}
      {(isSchool || isCollege) && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {isSchool ? "School" : "College"} Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSchool && (
              <Tabs defaultValue="classes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="divisions">Divisions</TabsTrigger>
                  <TabsTrigger value="streams">Streams</TabsTrigger>
                </TabsList>
                <TabsContent value="classes">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Classes</h3>
                    <ConfigSection title="Classes" items={classes} setItems={setClasses} />
                  </div>
                </TabsContent>
                <TabsContent value="divisions">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Divisions</h3>
                    <ConfigSection title="Divisions" items={divisions} setItems={setDivisions} />
                  </div>
                </TabsContent>
                <TabsContent value="streams">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Streams</h3>
                    <ConfigSection title="Streams" items={streams} setItems={setStreams} />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {isCollege && (
              <Tabs defaultValue="courses" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="years">Year/Semester</TabsTrigger>
                  <TabsTrigger value="subjects">Subjects/Branches</TabsTrigger>
                </TabsList>
                <TabsContent value="courses">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Courses</h3>
                    <ConfigSection title="Courses" items={courses} setItems={setCourses} />
                  </div>
                </TabsContent>
                <TabsContent value="years">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Year/Semester</h3>
                    <ConfigSection title="Year/Semester" items={yearSemesters} setItems={setYearSemesters} />
                  </div>
                </TabsContent>
                <TabsContent value="subjects">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Subjects/Branches</h3>
                    <ConfigSection title="Subjects/Branches" items={subjects} setItems={setSubjects} />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}

      {/* Non-Academic Institution Settings */}
      {!isSchool && !isCollege && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Staff Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="text-lg font-semibold mb-4">Designations</h3>
              <ConfigSection title="Designations" items={designations} setItems={setDesignations} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

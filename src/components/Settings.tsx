import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit2, Trash2, Upload, School, GraduationCap, Building } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

export const Settings = () => {
  const { 
    classes, setClasses, 
    divisions, setDivisions, 
    streams, setStreams,
    courses, setCourses, 
    yearSemesters, setYearSemesters, 
    subjects, setSubjects,
    designations, setDesignations, 
    genres, setGenres,
    languages, setLanguages,
    institutionLogo, setInstitutionLogo 
  } = useSettings();
  
  const { toast } = useToast();
  const [institutionType, setInstitutionType] = useState("school");
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<{id: string, name: string, type: string} | null>(null);

  const handleAddItem = (type: string) => {
    if (!newItemName.trim()) return;

    const newItem = { id: Date.now().toString(), name: newItemName.trim() };

    switch (type) {
      case 'classes':
        setClasses([...classes, newItem]);
        setNewItemName("");
        break;
      case 'divisions':
        setDivisions([...divisions, newItem]);
        setNewItemName("");
        break;
      case 'streams':
        setStreams([...streams, newItem]);
        setNewItemName("");
        break;
      case 'courses':
        setCourses([...courses, newItem]);
        setNewItemName("");
        break;
      case 'yearSemesters':
        setYearSemesters([...yearSemesters, newItem]);
        setNewItemName("");
        break;
      case 'subjects':
        setSubjects([...subjects, newItem]);
        setNewItemName("");
        break;
      case 'designations':
        setDesignations([...designations, newItem]);
        setNewItemName("");
        break;
      case 'genres':
        setGenres([...genres, newItem]);
        setNewItemName("");
        break;
      case 'languages':
        setLanguages([...languages, newItem]);
        setNewItemName("");
        break;
      default:
        break;
    }

    toast({
      title: "Success",
      description: `${type.slice(0, -1)} added successfully!`,
    });
  };

  const handleEditItem = (item: { id: string, name: string }, type: string) => {
    setEditingItem({ ...item, type });
    setNewItemName(item.name);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItemName.trim()) return;

    const updatedItem = { ...editingItem, name: newItemName.trim() };

    switch (editingItem.type) {
      case 'classes':
        setClasses(classes.map(cls => cls.id === editingItem.id ? updatedItem : cls));
        break;
      case 'divisions':
        setDivisions(divisions.map(div => div.id === editingItem.id ? updatedItem : div));
        break;
      case 'streams':
        setStreams(streams.map(stream => stream.id === editingItem.id ? updatedItem : stream));
        break;
      case 'courses':
        setCourses(courses.map(course => course.id === editingItem.id ? updatedItem : course));
        break;
      case 'yearSemesters':
        setYearSemesters(yearSemesters.map(ys => ys.id === editingItem.id ? updatedItem : ys));
        break;
      case 'subjects':
        setSubjects(subjects.map(subject => subject.id === editingItem.id ? updatedItem : subject));
        break;
      case 'designations':
        setDesignations(designations.map(designation => designation.id === editingItem.id ? updatedItem : designation));
        break;
      case 'genres':
        setGenres(genres.map(genre => genre.id === editingItem.id ? updatedItem : genre));
        break;
      case 'languages':
        setLanguages(languages.map(language => language.id === editingItem.id ? updatedItem : language));
        break;
      default:
        break;
    }

    setEditingItem(null);
    setNewItemName("");

    toast({
      title: "Success",
      description: `${editingItem.type.slice(0, -1)} updated successfully!`,
    });
  };

  const handleDeleteItem = (id: string, type: string) => {
    switch (type) {
      case 'classes':
        setClasses(classes.filter(cls => cls.id !== id));
        break;
      case 'divisions':
        setDivisions(divisions.filter(div => div.id !== id));
        break;
      case 'streams':
        setStreams(streams.filter(stream => stream.id !== id));
        break;
      case 'courses':
        setCourses(courses.filter(course => course.id !== id));
        break;
      case 'yearSemesters':
        setYearSemesters(yearSemesters.filter(ys => ys.id !== id));
        break;
      case 'subjects':
        setSubjects(subjects.filter(subject => subject.id !== id));
        break;
      case 'designations':
        setDesignations(designations.filter(designation => designation.id !== id));
        break;
      case 'genres':
        setGenres(genres.filter(genre => genre.id !== id));
        break;
      case 'languages':
        setLanguages(languages.filter(language => language.id !== id));
        break;
      default:
        break;
    }

    toast({
      title: "Success",
      description: `${type.slice(0, -1)} deleted successfully!`,
    });
  };

  const renderItemBadge = (item: { id: string, name: string }, type: string) => (
    <Badge key={item.id} className="gap-2">
      {item.name}
      <Edit2
        onClick={() => handleEditItem(item, type)}
        className="w-3 h-3 cursor-pointer hover:opacity-80"
      />
      <Trash2
        onClick={() => handleDeleteItem(item.id, type)}
        className="w-3 h-3 cursor-pointer hover:opacity-80"
      />
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="institution">Institution</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Institution Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="institutionType">Select Institution Type</Label>
                  <Select value={institutionType} onValueChange={setInstitutionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="college">College/University</SelectItem>
                      <SelectItem value="other">Other Institution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Designations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new designation"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Button onClick={() => handleAddItem('designations')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {designations.map((designation) => renderItemBadge(designation, 'designations'))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          {institutionType === "school" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="w-5 h-5" />
                    School Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Classes</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new class"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <Button onClick={() => handleAddItem('classes')}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {classes.map((cls) => renderItemBadge(cls, 'classes'))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Divisions</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new division"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <Button onClick={() => handleAddItem('divisions')}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {divisions.map((division) => renderItemBadge(division, 'divisions'))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Streams</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new stream"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                      />
                      <Button onClick={() => handleAddItem('streams')}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {streams.map((stream) => renderItemBadge(stream, 'streams'))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {institutionType === "college" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    College Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Courses</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new course"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <Button onClick={() => handleAddItem('courses')}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {courses.map((course) => renderItemBadge(course, 'courses'))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Year/Semester</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new year/semester"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <Button onClick={() => handleAddItem('yearSemesters')}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {yearSemesters.map((ys) => renderItemBadge(ys, 'yearSemesters'))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Subjects/Branches</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new subject/branch"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                      />
                      <Button onClick={() => handleAddItem('subjects')}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => renderItemBadge(subject, 'subjects'))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Book Genres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new genre"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <Button onClick={() => handleAddItem('genres')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => renderItemBadge(genre, 'genres'))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new language"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <Button onClick={() => handleAddItem('languages')}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => renderItemBadge(language, 'languages'))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="institution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institution Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {institutionLogo && (
                  <img src={institutionLogo} alt="Institution Logo" className="w-16 h-16 object-contain" />
                )}
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

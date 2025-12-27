
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    publishers, setPublishers,
    institutionLogo, setInstitutionLogo
  } = useSettings();
  
  const { toast } = useToast();

  // Separate state for each section
  const [classInput, setClassInput] = useState("");
  const [divisionInput, setDivisionInput] = useState("");
  const [streamInput, setStreamInput] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [yearSemesterInput, setYearSemesterInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [designationInput, setDesignationInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [publisherInput, setPublisherInput] = useState("");

  // Edit states for each section
  const [editingClass, setEditingClass] = useState<{id: string, name: string} | null>(null);
  const [editingDivision, setEditingDivision] = useState<{id: string, name: string} | null>(null);
  const [editingStream, setEditingStream] = useState<{id: string, name: string} | null>(null);
  const [editingCourse, setEditingCourse] = useState<{id: string, name: string} | null>(null);
  const [editingYearSemester, setEditingYearSemester] = useState<{id: string, name: string} | null>(null);
  const [editingSubject, setEditingSubject] = useState<{id: string, name: string} | null>(null);
  const [editingDesignation, setEditingDesignation] = useState<{id: string, name: string} | null>(null);
  const [editingGenre, setEditingGenre] = useState<{id: string, name: string} | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<{id: string, name: string} | null>(null);
  const [editingPublisher, setEditingPublisher] = useState<{id: string, name: string} | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{item: {id: string, name: string}, type: string} | null>(null);

  const handleAddItem = (type: string, input: string, setInput: (value: string) => void, items: any[], setItems: (items: any[]) => void) => {
    if (!input.trim()) return;

    const newItem = { id: Date.now().toString(), name: input.trim() };
    setItems([...items, newItem]);
    setInput("");
    toast({
      title: "Success",
      description: `${type} added successfully!`,
    });
  };

  const handleEditItem = (item: { id: string, name: string }, type: string, setEditing: (item: any) => void, setInput: (value: string) => void) => {
    setEditing(item);
    setInput(item.name);
  };

  const handleUpdateItem = (type: string, editingItem: any, input: string, setEditing: (item: any) => void, setInput: (value: string) => void, items: any[], setItems: (items: any[]) => void) => {
    if (!editingItem || !input.trim()) return;

    const updatedItems = items.map(item => 
      item.id === editingItem.id ? { ...item, name: input.trim() } : item
    );
    setItems(updatedItems);
    setEditing(null);
    setInput("");

    toast({
      title: "Success",
      description: `${type} updated successfully!`,
    });
  };

  const handleDeleteConfirmation = (item: { id: string, name: string }, type: string) => {
    setDeleteConfirmation({ item, type });
  };

  const handleDeleteItem = () => {
    if (!deleteConfirmation) return;

    const { item, type } = deleteConfirmation;

    switch (type) {
      case 'classes':
        setClasses(classes.filter(cls => cls.id !== item.id));
        break;
      case 'divisions':
        setDivisions(divisions.filter(div => div.id !== item.id));
        break;
      case 'streams':
        setStreams(streams.filter(stream => stream.id !== item.id));
        break;
      case 'courses':
        setCourses(courses.filter(course => course.id !== item.id));
        break;
      case 'yearSemesters':
        setYearSemesters(yearSemesters.filter(ys => ys.id !== item.id));
        break;
      case 'subjects':
        setSubjects(subjects.filter(subject => subject.id !== item.id));
        break;
      case 'designations':
        setDesignations(designations.filter(designation => designation.id !== item.id));
        break;
      case 'genres':
        setGenres(genres.filter(genre => genre.id !== item.id));
        break;
      case 'languages':
        setLanguages(languages.filter(language => language.id !== item.id));
        break;
      case 'publishers':
        setPublishers(publishers.filter(publisher => publisher.id !== item.id));
        break;
    }

    setDeleteConfirmation(null);
    toast({
      title: "Success",
      description: `${type.slice(0, -1)} deleted successfully!`,
    });
  };

  const renderItemBadge = (item: { id: string, name: string }, type: string) => (
    <Badge key={item.id} className="gap-2">
      {item.name}
      <Edit2
        onClick={() => {
          switch (type) {
            case 'classes':
              handleEditItem(item, type, setEditingClass, setClassInput);
              break;
            case 'divisions':
              handleEditItem(item, type, setEditingDivision, setDivisionInput);
              break;
            case 'streams':
              handleEditItem(item, type, setEditingStream, setStreamInput);
              break;
            case 'courses':
              handleEditItem(item, type, setEditingCourse, setCourseInput);
              break;
            case 'yearSemesters':
              handleEditItem(item, type, setEditingYearSemester, setYearSemesterInput);
              break;
            case 'subjects':
              handleEditItem(item, type, setEditingSubject, setSubjectInput);
              break;
            case 'designations':
              handleEditItem(item, type, setEditingDesignation, setDesignationInput);
              break;
            case 'genres':
              handleEditItem(item, type, setEditingGenre, setGenreInput);
              break;
            case 'languages':
              handleEditItem(item, type, setEditingLanguage, setLanguageInput);
              break;
            case 'publishers':
              handleEditItem(item, type, setEditingPublisher, setPublisherInput);
              break;
          }
        }}
        className="w-3 h-3 cursor-pointer hover:opacity-80"
      />
      <Trash2
        onClick={() => handleDeleteConfirmation(item, type)}
        className="w-3 h-3 cursor-pointer hover:opacity-80"
      />
    </Badge>
  );

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInstitutionLogo(result);
        toast({
          title: "Success",
          description: "Institution logo uploaded successfully!",
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
              <CardTitle>Designations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new designation"
                  value={designationInput}
                  onChange={(e) => setDesignationInput(e.target.value)}
                />
                {editingDesignation ? (
                  <Button onClick={() => handleUpdateItem('designation', editingDesignation, designationInput, setEditingDesignation, setDesignationInput, designations, setDesignations)}>
                    Update
                  </Button>
                ) : (
                  <Button onClick={() => handleAddItem('designation', designationInput, setDesignationInput, designations, setDesignations)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {designations.map((designation) => renderItemBadge(designation, 'designations'))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
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
                      value={classInput}
                      onChange={(e) => setClassInput(e.target.value)}
                    />
                    {editingClass ? (
                      <Button onClick={() => handleUpdateItem('class', editingClass, classInput, setEditingClass, setClassInput, classes, setClasses)}>
                        Update
                      </Button>
                    ) : (
                      <Button onClick={() => handleAddItem('class', classInput, setClassInput, classes, setClasses)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
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
                      value={divisionInput}
                      onChange={(e) => setDivisionInput(e.target.value)}
                    />
                    {editingDivision ? (
                      <Button onClick={() => handleUpdateItem('division', editingDivision, divisionInput, setEditingDivision, setDivisionInput, divisions, setDivisions)}>
                        Update
                      </Button>
                    ) : (
                      <Button onClick={() => handleAddItem('division', divisionInput, setDivisionInput, divisions, setDivisions)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
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
                    value={streamInput}
                    onChange={(e) => setStreamInput(e.target.value)}
                  />
                  {editingStream ? (
                    <Button onClick={() => handleUpdateItem('stream', editingStream, streamInput, setEditingStream, setStreamInput, streams, setStreams)}>
                      Update
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddItem('stream', streamInput, setStreamInput, streams, setStreams)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {streams.map((stream) => renderItemBadge(stream, 'streams'))}
                </div>
              </div>
            </CardContent>
          </Card>

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
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                    />
                    {editingCourse ? (
                      <Button onClick={() => handleUpdateItem('course', editingCourse, courseInput, setEditingCourse, setCourseInput, courses, setCourses)}>
                        Update
                      </Button>
                    ) : (
                      <Button onClick={() => handleAddItem('course', courseInput, setCourseInput, courses, setCourses)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
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
                      value={yearSemesterInput}
                      onChange={(e) => setYearSemesterInput(e.target.value)}
                    />
                    {editingYearSemester ? (
                      <Button onClick={() => handleUpdateItem('year/semester', editingYearSemester, yearSemesterInput, setEditingYearSemester, setYearSemesterInput, yearSemesters, setYearSemesters)}>
                        Update
                      </Button>
                    ) : (
                      <Button onClick={() => handleAddItem('year/semester', yearSemesterInput, setYearSemesterInput, yearSemesters, setYearSemesters)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
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
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                  />
                  {editingSubject ? (
                    <Button onClick={() => handleUpdateItem('subject', editingSubject, subjectInput, setEditingSubject, setSubjectInput, subjects, setSubjects)}>
                      Update
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddItem('subject', subjectInput, setSubjectInput, subjects, setSubjects)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => renderItemBadge(subject, 'subjects'))}
                </div>
              </div>
            </CardContent>
          </Card>
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
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                  />
                  {editingGenre ? (
                    <Button onClick={() => handleUpdateItem('genre', editingGenre, genreInput, setEditingGenre, setGenreInput, genres, setGenres)}>
                      Update
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddItem('genre', genreInput, setGenreInput, genres, setGenres)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
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
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                  />
                  {editingLanguage ? (
                    <Button onClick={() => handleUpdateItem('language', editingLanguage, languageInput, setEditingLanguage, setLanguageInput, languages, setLanguages)}>
                      Update
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddItem('language', languageInput, setLanguageInput, languages, setLanguages)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => renderItemBadge(language, 'languages'))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new publisher"
                    value={publisherInput}
                    onChange={(e) => setPublisherInput(e.target.value)}
                  />
                  {editingPublisher ? (
                    <Button onClick={() => handleUpdateItem('publisher', editingPublisher, publisherInput, setEditingPublisher, setPublisherInput, publishers, setPublishers)}>
                      Update
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddItem('publisher', publisherInput, setPublisherInput, publishers, setPublishers)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {publishers.map((publisher) => renderItemBadge(publisher, 'publishers'))}
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
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4" />
                        Add Picture
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete "{deleteConfirmation?.item.name}"?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteItem}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

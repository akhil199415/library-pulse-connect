
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Upload, School, GraduationCap, Building, StickyNote, Bell } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Reminder {
  id: string;
  title: string;
  content: string;
  dueDate: string;
  createdAt: string;
}

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
    institutionLogo, setInstitutionLogo,
    backgroundColor, setBackgroundColor 
  } = useSettings();
  
  const { toast } = useToast();
  const [institutionType, setInstitutionType] = useState("school");
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<{id: string, name: string, type: string} | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{item: {id: string, name: string}, type: string} | null>(null);
  
  // Notes and Reminders
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newReminder, setNewReminder] = useState({ title: "", content: "", dueDate: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const backgroundColors = [
    { name: "Black", value: "#000000" },
    { name: "Deep Blue", value: "#1e3a8a" },
    { name: "Dark Green", value: "#14532d" },
    { name: "Purple", value: "#581c87" },
    { name: "Maroon", value: "#7f1d1d" },
    { name: "Teal", value: "#134e4a" },
    { name: "Indigo", value: "#312e81" },
    { name: "Slate", value: "#1e293b" }
  ];

  const handleAddItem = (type: string) => {
    if (!newItemName.trim()) return;

    const newItem = { id: Date.now().toString(), name: newItemName.trim() };

    switch (type) {
      case 'classes':
        setClasses([...classes, newItem]);
        break;
      case 'divisions':
        setDivisions([...divisions, newItem]);
        break;
      case 'streams':
        setStreams([...streams, newItem]);
        break;
      case 'courses':
        setCourses([...courses, newItem]);
        break;
      case 'yearSemesters':
        setYearSemesters([...yearSemesters, newItem]);
        break;
      case 'subjects':
        setSubjects([...subjects, newItem]);
        break;
      case 'designations':
        setDesignations([...designations, newItem]);
        break;
      case 'genres':
        setGenres([...genres, newItem]);
        break;
      case 'languages':
        setLanguages([...languages, newItem]);
        break;
      case 'publishers':
        setPublishers([...publishers, newItem]);
        break;
      default:
        break;
    }

    setNewItemName("");
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
      case 'publishers':
        setPublishers(publishers.map(publisher => publisher.id === editingItem.id ? updatedItem : publisher));
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
      default:
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
        onClick={() => handleEditItem(item, type)}
        className="w-3 h-3 cursor-pointer hover:opacity-80"
      />
      <Trash2
        onClick={() => handleDeleteConfirmation(item, type)}
        className="w-3 h-3 cursor-pointer hover:opacity-80"
      />
    </Badge>
  );

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      createdAt: new Date().toISOString()
    };

    setNotes([...notes, note]);
    setNewNote({ title: "", content: "" });
    toast({ title: "Success", description: "Note added successfully!" });
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.content.trim() || !newReminder.dueDate) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title.trim(),
      content: newReminder.content.trim(),
      dueDate: newReminder.dueDate,
      createdAt: new Date().toISOString()
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ title: "", content: "", dueDate: "" });
    toast({ title: "Success", description: "Reminder added successfully!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="notes">Notes & Reminders</TabsTrigger>
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
              <CardTitle>Background Color</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {backgroundColors.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded border cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setBackgroundColor(color.value)}
                    />
                    <label className="text-sm">{color.name}</label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Label>Selected Color: {backgroundColor}</Label>
                <div className="w-full h-4 rounded mt-2" style={{ backgroundColor }}></div>
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
                {editingItem ? (
                  <Button onClick={handleUpdateItem}>Update</Button>
                ) : (
                  <Button onClick={() => handleAddItem('designations')}>
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
                  {editingItem?.type === 'genres' ? (
                    <Button onClick={handleUpdateItem}>Update</Button>
                  ) : (
                    <Button onClick={() => handleAddItem('genres')}>
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
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  {editingItem?.type === 'languages' ? (
                    <Button onClick={handleUpdateItem}>Update</Button>
                  ) : (
                    <Button onClick={() => handleAddItem('languages')}>
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
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  {editingItem?.type === 'publishers' ? (
                    <Button onClick={handleUpdateItem}>Update</Button>
                  ) : (
                    <Button onClick={() => handleAddItem('publishers')}>
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
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    rows={3}
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <Card key={note.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{note.title}</h4>
                          <p className="text-sm text-muted-foreground">{note.content}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setEditingNote(note)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setNotes(notes.filter(n => n.id !== note.id))}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Reminder title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Reminder content"
                    value={newReminder.content}
                    onChange={(e) => setNewReminder({...newReminder, content: e.target.value})}
                    rows={2}
                  />
                  <Input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                  />
                  <Button onClick={handleAddReminder}>Add Reminder</Button>
                </div>
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <Card key={reminder.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{reminder.title}</h4>
                          <p className="text-sm text-muted-foreground">{reminder.content}</p>
                          <p className="text-xs text-blue-600">Due: {reminder.dueDate}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => setEditingReminder(reminder)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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

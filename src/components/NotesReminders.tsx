
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StickyNote, Bell, Edit2, Trash2, Plus } from "lucide-react";
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

export const NotesReminders = () => {
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newReminder, setNewReminder] = useState({ title: "", content: "", dueDate: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{item: any, type: 'note' | 'reminder'} | null>(null);

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

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content });
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setNewReminder({ title: reminder.title, content: reminder.content, dueDate: reminder.dueDate });
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.title.trim() || !newNote.content.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === editingNote.id 
        ? { ...note, title: newNote.title.trim(), content: newNote.content.trim() }
        : note
    );
    setNotes(updatedNotes);
    setEditingNote(null);
    setNewNote({ title: "", content: "" });
    toast({ title: "Success", description: "Note updated successfully!" });
  };

  const handleUpdateReminder = () => {
    if (!editingReminder || !newReminder.title.trim() || !newReminder.content.trim() || !newReminder.dueDate) return;

    const updatedReminders = reminders.map(reminder => 
      reminder.id === editingReminder.id 
        ? { ...reminder, title: newReminder.title.trim(), content: newReminder.content.trim(), dueDate: newReminder.dueDate }
        : reminder
    );
    setReminders(updatedReminders);
    setEditingReminder(null);
    setNewReminder({ title: "", content: "", dueDate: "" });
    toast({ title: "Success", description: "Reminder updated successfully!" });
  };

  const handleDeleteConfirmation = (item: any, type: 'note' | 'reminder') => {
    setDeleteConfirmation({ item, type });
  };

  const handleDelete = () => {
    if (!deleteConfirmation) return;

    if (deleteConfirmation.type === 'note') {
      setNotes(notes.filter(note => note.id !== deleteConfirmation.item.id));
      toast({ title: "Success", description: "Note deleted successfully!" });
    } else {
      setReminders(reminders.filter(reminder => reminder.id !== deleteConfirmation.item.id));
      toast({ title: "Success", description: "Reminder deleted successfully!" });
    }
    setDeleteConfirmation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Notes & Reminders</h1>
      </div>

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
              {editingNote ? (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateNote}>Save Changes</Button>
                  <Button variant="outline" onClick={() => {
                    setEditingNote(null);
                    setNewNote({ title: "", content: "" });
                  }}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={handleAddNote}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {notes.map((note) => (
                <Card key={note.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditNote(note)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteConfirmation(note, 'note')}>
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
              {editingReminder ? (
                <div className="flex gap-2">
                  <Button onClick={handleUpdateReminder}>Save Changes</Button>
                  <Button variant="outline" onClick={() => {
                    setEditingReminder(null);
                    setNewReminder({ title: "", content: "", dueDate: "" });
                  }}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={handleAddReminder}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              )}
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
                      <Button size="sm" variant="outline" onClick={() => handleEditReminder(reminder)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteConfirmation(reminder, 'reminder')}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this {deleteConfirmation?.type}?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

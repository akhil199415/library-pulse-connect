import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Search, Settings, AlertTriangle, Wrench, BookX, Clock, Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookCard } from "./book-management/BookCard";
import { BookFilters } from "./book-management/BookFilters";
import { AddBookDialog } from "./book-management/AddBookDialog";
import { RepaymentDialog as RepaymentDialogComponent } from "./book-management/RepaymentDialog";
import { MissingBookCard } from "./book-management/MissingBookCard";

interface Book {
  id: string;
  bookNumber: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  isbn: string;
  price: number;
  shelf: string;
  rack: string;
  condition: string;
  type: string;
  source: string;
  donorName?: string;
  purchaseDate?: string;
  addedDate: string;
  isIssued: boolean;
  borrower?: string;
  borrowerType?: string;
  borrowerDetails?: any;
  issueDate?: string;
  dueDate?: string;
  fineExemptionDate?: string;
  fineExemptionReason?: string;
  remindersSent?: number;
  lastReminderDate?: string;
}

interface NotificationSettings {
  whatsappEnabled: boolean;
  reminderDays: number;
  autoSnooze: boolean;
}

export const BookManagement = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      bookNumber: "BK001234",
      title: "Introduction to Computer Science",
      author: "John Smith",
      genre: "Technology",
      publisher: "Tech Publications",
      isbn: "978-0123456789",
      price: 450,
      shelf: "A1",
      rack: "R1",
      condition: "Active",
      type: "Circulating",
      source: "Purchase",
      purchaseDate: "2024-01-15",
      addedDate: "2024-01-15",
      isIssued: true,
      borrower: "Emily Parker",
      borrowerType: "Student",
      borrowerDetails: { class: "10th", division: "A", rollNo: "15" },
      issueDate: "2024-05-20",
      dueDate: "2024-06-03",
      remindersSent: 1,
      lastReminderDate: "2024-06-01"
    },
    {
      id: "2",
      bookNumber: "BK001235",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      publisher: "Scribner",
      isbn: "978-0743273565",
      price: 380,
      shelf: "B2",
      rack: "R2",
      condition: "Active",
      type: "Circulating",
      source: "Donation",
      donorName: "Jane Doe",
      addedDate: "2024-02-20",
      isIssued: false,
    },
    {
      id: "3",
      bookNumber: "BK001236",
      title: "Advanced Mathematics",
      author: "Dr. Alison Williams",
      genre: "Education",
      publisher: "Academic Press",
      isbn: "978-0123456796",
      price: 520,
      shelf: "C3",
      rack: "R3",
      condition: "Obsolete",
      type: "Reference",
      source: "Purchase",
      purchaseDate: "2023-11-01",
      addedDate: "2023-11-01",
      isIssued: false,
    },
    {
      id: "4",
      bookNumber: "BK001237",
      title: "Physics Fundamentals",
      author: "Robert Johnson",
      genre: "Education",
      publisher: "Science Books Ltd.",
      isbn: "978-0123456802",
      price: 480,
      shelf: "D4",
      rack: "R4",
      condition: "Binding",
      type: "Reference",
      source: "Purchase",
      purchaseDate: "2023-12-10",
      addedDate: "2023-12-10",
      isIssued: false,
    },
    {
      id: "5",
      bookNumber: "BK001238",
      title: "Chemistry Essentials",
      author: "Sarah Thompson",
      genre: "Education",
      publisher: "Educational Publishers",
      isbn: "978-0123456819",
      price: 460,
      shelf: "E5",
      rack: "R5",
      condition: "Missing",
      type: "Reference",
      source: "Purchase",
      purchaseDate: "2024-03-01",
      addedDate: "2024-03-01",
      isIssued: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedMissingBook, setSelectedMissingBook] = useState<Book | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    whatsappEnabled: true,
    reminderDays: 2,
    autoSnooze: false
  });

  function generateBookNumber(): string {
    const lastBook = books[books.length - 1];
    if (!lastBook) return "BK001001";
    
    const lastNumber = parseInt(lastBook.bookNumber.substring(2));
    const newNumber = lastNumber + 1;
    return `BK${newNumber.toString().padStart(6, '0')}`;
  }

  const handleAddBook = (bookData: Omit<Book, 'id' | 'bookNumber' | 'addedDate' | 'isIssued'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      bookNumber: generateBookNumber(),
      addedDate: new Date().toISOString().split('T')[0],
      isIssued: false,
    };
    setBooks([...books, newBook]);
    toast({
      title: "Book Added",
      description: "New book has been added to the library.",
    });
  };

  const handleUpdateBook = (bookId: string, bookData: Partial<Book>) => {
    setBooks(books.map(book => book.id === bookId ? { ...book, ...bookData } : book));
    toast({
      title: "Book Updated",
      description: "Book information has been updated successfully.",
    });
  };

  // New function for handling fine exemptions
  const handleFineExemption = (bookId: string, reason: string, exemptionDate: string) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, fineExemptionDate: exemptionDate, fineExemptionReason: reason }
        : book
    ));
    
    toast({
      title: "Fine Exemption Applied",
      description: "Fine calculation will be adjusted from the exemption date.",
    });
  };

  // New function for sending reminders
  const sendReminder = (book: Book, reminderType: 'whatsapp' | 'internal') => {
    const updatedBook = {
      ...book,
      remindersSent: (book.remindersSent || 0) + 1,
      lastReminderDate: new Date().toISOString().split('T')[0]
    };

    setBooks(books.map(b => b.id === book.id ? updatedBook : b));

    if (reminderType === 'whatsapp') {
      // In a real app, this would integrate with WhatsApp API
      toast({
        title: "WhatsApp Reminder Sent",
        description: `Reminder sent to ${book.borrower} about book return.`,
      });
    } else {
      toast({
        title: "Internal Reminder Set",
        description: "Reminder notification has been logged in the system.",
      });
    }
  };

  // New function for snoozing due dates
  const snoozeDueDate = (bookId: string, days: number) => {
    setBooks(books.map(book => {
      if (book.id === bookId && book.dueDate) {
        const currentDueDate = new Date(book.dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + days);
        return { ...book, dueDate: currentDueDate.toISOString().split('T')[0] };
      }
      return book;
    }));

    toast({
      title: "Due Date Extended",
      description: `Due date has been extended by ${days} days.`,
    });
  };

  // Check for upcoming due dates and show notifications
  useEffect(() => {
    const checkUpcomingDueDates = () => {
      const today = new Date();
      const reminderDate = new Date();
      reminderDate.setDate(today.getDate() + notifications.reminderDays);

      books.forEach(book => {
        if (book.isIssued && book.dueDate) {
          const dueDate = new Date(book.dueDate);
          if (dueDate <= reminderDate && dueDate > today) {
            // Show notification for upcoming due date
            console.log(`Reminder: ${book.title} is due on ${book.dueDate} for ${book.borrower}`);
          }
        }
      });
    };

    checkUpcomingDueDates();
  }, [books, notifications.reminderDays]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.bookNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || book.type.toLowerCase() === filterType.toLowerCase();
    const matchesCondition = filterCondition === "all" || book.condition.toLowerCase() === filterCondition.toLowerCase();
    
    return matchesSearch && matchesType && matchesCondition;
  });

  const activeBooks = filteredBooks.filter(book => book.condition === "Active");
  const obsoleteBooks = filteredBooks.filter(book => book.condition === "Obsolete");
  const bindingBooks = filteredBooks.filter(book => book.condition === "Binding");
  const missingBooks = filteredBooks.filter(book => book.condition === "Missing");

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCondition("all");
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (book: Book) => {
    setBooks(books.filter(b => b.id !== book.id));
    toast({
      title: "Book Deleted",
      description: "Book has been removed from the library.",
    });
  };

  const handleMarkReturned = (book: Book) => {
    setBooks(books.map(b => 
      b.id === book.id 
        ? { ...b, condition: "Active", isIssued: false, borrower: undefined, borrowerType: undefined, borrowerDetails: undefined, issueDate: undefined, dueDate: undefined }
        : b
    ));
    toast({
      title: "Book Returned",
      description: "Book has been marked as returned and is now available.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Book Management</h1>
        <AddBookDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          editingBook={editingBook}
          onSave={(bookData) => {
            if (editingBook) {
              setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...bookData } : b));
              toast({ title: "Book Updated", description: "Book information has been updated successfully." });
            } else {
              const newBook: Book = {
                ...bookData,
                id: Date.now().toString(),
                bookNumber: generateBookNumber(),
                addedDate: new Date().toISOString().split('T')[0],
                isIssued: false,
              };
              setBooks([...books, newBook]);
              toast({ title: "Book Added", description: "New book has been added to the library." });
            }
            setEditingBook(null);
            setIsAddDialogOpen(false);
          }}
        />
      </div>

      <BookFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCondition={filterCondition}
        setFilterCondition={setFilterCondition}
        onClearFilters={clearFilters}
      />

      {/* Notification Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reminderDays">Reminder Days Before Due</Label>
              <Select
                value={notifications.reminderDays.toString()}
                onValueChange={(value) => setNotifications({...notifications, reminderDays: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="whatsapp"
                checked={notifications.whatsappEnabled}
                onChange={(e) => setNotifications({...notifications, whatsappEnabled: e.target.checked})}
              />
              <Label htmlFor="whatsapp">Enable WhatsApp Notifications</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Active ({activeBooks.length})
          </TabsTrigger>
          <TabsTrigger value="obsolete" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Obsolete ({obsoleteBooks.length})
          </TabsTrigger>
          <TabsTrigger value="binding" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Binding ({bindingBooks.length})
          </TabsTrigger>
          <TabsTrigger value="missing" className="flex items-center gap-2">
            <BookX className="w-4 h-4" />
            Missing ({missingBooks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active books found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeBooks.map((book) => (
                <div key={book.id} className="space-y-4">
                  <BookCard
                    book={book}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMarkReturned={handleMarkReturned}
                  />
                  
                  {/* Fine Exemption and Reminder Controls for Issued Books */}
                  {book.isIssued && (
                    <Card className="ml-8 border-l-4 border-l-yellow-400">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Book Management Actions</h4>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Due: {book.dueDate}</span>
                              {book.fineExemptionDate && (
                                <span className="text-green-600">Fine exempt from: {book.fineExemptionDate}</span>
                              )}
                              {book.lastReminderDate && (
                                <span>Last reminder: {book.lastReminderDate}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Snooze Options */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Snooze
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Extend Due Date</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-muted-foreground">
                                    Current due date: {book.dueDate}
                                  </p>
                                  <div className="flex gap-2">
                                    <Button onClick={() => snoozeDueDate(book.id, 2)} variant="outline">
                                      +2 Days
                                    </Button>
                                    <Button onClick={() => snoozeDueDate(book.id, 5)} variant="outline">
                                      +5 Days
                                    </Button>
                                    <Button onClick={() => snoozeDueDate(book.id, 7)} variant="outline">
                                      +1 Week
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Fine Exemption */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Fine Exemption
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Apply Fine Exemption</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="exemptionDate">Exemption From Date</Label>
                                    <Input
                                      id="exemptionDate"
                                      type="date"
                                      onChange={(e) => {
                                        const reason = prompt("Please enter the reason for fine exemption:");
                                        if (reason) {
                                          handleFineExemption(book.id, reason, e.target.value);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Send Reminder */}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => sendReminder(book, notifications.whatsappEnabled ? 'whatsapp' : 'internal')}
                            >
                              {notifications.whatsappEnabled ? (
                                <>
                                  <Bell className="w-4 h-4 mr-1" />
                                  WhatsApp
                                </>
                              ) : (
                                <>
                                  <BellOff className="w-4 h-4 mr-1" />
                                  Remind
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="obsolete" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <AlertTriangle className="w-16 h-16 mx-auto text-orange-500" />
                <div>
                  <h3 className="text-xl font-semibold">Obsolete Books</h3>
                  <p className="text-muted-foreground">
                    Books marked as obsolete are no longer available for circulation and are kept for record purposes only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {obsoleteBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No obsolete books found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {obsoleteBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="binding" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Wrench className="w-16 h-16 mx-auto text-blue-500" />
                <div>
                  <h3 className="text-xl font-semibold">Books in Binding</h3>
                  <p className="text-muted-foreground">
                    Books currently at the bindery for repair work. They will be available once the binding process is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {bindingBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No books in binding found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bindingBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMarkReturned={handleMarkReturned}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="missing" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <BookX className="w-16 h-16 mx-auto text-red-500" />
                <div>
                  <h3 className="text-xl font-semibold">Missing Books</h3>
                  <p className="text-muted-foreground">
                    Books that have been lost or not returned by borrowers. Repayment options and records are managed here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {missingBooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookX className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No missing books found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {missingBooks.map((book) => (
                <MissingBookCard
                  key={book.id}
                  book={book}
                  onRepayment={(book) => setSelectedMissingBook(book)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedMissingBook && (
        <RepaymentDialogComponent
          book={selectedMissingBook}
          isOpen={!!selectedMissingBook}
          onOpenChange={(open) => !open && setSelectedMissingBook(null)}
          onRepaymentComplete={(book, repaymentData) => {
            console.log('Repayment completed:', book, repaymentData);
            setBooks(books.map(b => 
              b.id === book.id 
                ? { ...b, condition: "Active", isIssued: false, borrower: undefined, borrowerType: undefined, borrowerDetails: undefined }
                : b
            ));
            setSelectedMissingBook(null);
            toast({
              title: "Repayment Processed",
              description: "Book repayment has been processed successfully.",
            });
          }}
        />
      )}
    </div>
  );
};

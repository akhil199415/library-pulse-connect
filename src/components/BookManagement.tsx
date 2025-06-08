import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, BookOpen, Calendar, User, FileText, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

interface MissingBookRecord {
  id: string;
  book: Book;
  missingPersonType: string;
  missingPersonDetails: any;
  reportedDate: string;
  repaymentMode?: string;
  replacementBook?: Book;
  fineAmount?: number;
  transactionNumber?: string;
  receiptGenerated: boolean;
  status: 'pending' | 'resolved';
}

export const BookManagement = () => {
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
      shelf: "A",
      rack: "1",
      condition: "Active",
      type: "Circulating",
      source: "Purchase",
      purchaseDate: "2024-01-15",
      addedDate: "2024-01-15",
      isIssued: true,
      borrower: "Emily Parker",
      borrowerType: "Student",
      borrowerDetails: { class: "10th", division: "A", rollNo: "101" },
      issueDate: "2024-05-20",
      dueDate: "2024-06-03",
    },
    {
      id: "2",
      bookNumber: "BK001235",
      title: "Modern Physics",
      author: "Dr. Sarah Johnson",
      genre: "Science",
      publisher: "Academic Press",
      isbn: "978-0987654321",
      price: 620,
      shelf: "B",
      rack: "3",
      condition: "Obsolete",
      type: "Reference",
      source: "Donation",
      donorName: "Alumni Association",
      addedDate: "2024-02-10",
      isIssued: false,
    },
    {
      id: "3",
      bookNumber: "BK001236",
      title: "Advanced Mathematics",
      author: "Prof. Mike Wilson",
      genre: "Mathematics",
      publisher: "Math Publications",
      isbn: "978-0111222333",
      price: 550,
      shelf: "C",
      rack: "2",
      condition: "Binding",
      type: "Circulating",
      source: "Purchase",
      purchaseDate: "2024-03-20",
      addedDate: "2024-03-20",
      isIssued: false,
    },
    {
      id: "4",
      bookNumber: "BK001237",
      title: "History of Science",
      author: "Dr. Lisa Brown",
      genre: "History",
      publisher: "History Press",
      isbn: "978-0444555666",
      price: 480,
      shelf: "D",
      rack: "1",
      condition: "Missing",
      type: "Circulating",
      source: "Purchase",
      purchaseDate: "2024-04-10",
      addedDate: "2024-04-10",
      isIssued: false,
      borrower: "Alex Johnson",
      borrowerType: "Teacher",
      borrowerDetails: { subject: "History", staffRoom: "A-101" },
    },
  ]);

  const [missingRecords, setMissingRecords] = useState<MissingBookRecord[]>([
    {
      id: "1",
      book: books.find(b => b.id === "4")!,
      missingPersonType: "Teacher",
      missingPersonDetails: { name: "Alex Johnson", subject: "History", staffRoom: "A-101" },
      reportedDate: "2024-05-15",
      status: 'pending',
      receiptGenerated: false,
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMissingRecord, setSelectedMissingRecord] = useState<MissingBookRecord | null>(null);
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = useState(false);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    publisher: "",
    isbn: "",
    price: 0,
    shelf: "",
    rack: "",
    condition: "Active",
    type: "Circulating",
    source: "Purchase",
    donorName: "",
    purchaseDate: "",
  });

  const generateBookNumber = () => {
    const lastBook = books[books.length - 1];
    const lastNumber = lastBook ? parseInt(lastBook.bookNumber.slice(2)) : 1233;
    return `BK${String(lastNumber + 1).padStart(6, '0')}`;
  };

  const handleAddBook = () => {
    const book: Book = {
      id: Date.now().toString(),
      bookNumber: generateBookNumber(),
      ...newBook,
      addedDate: new Date().toISOString().split('T')[0],
      isIssued: false,
    };
    setBooks([...books, book]);
    setIsAddDialogOpen(false);
    setNewBook({
      title: "",
      author: "",
      genre: "",
      publisher: "",
      isbn: "",
      price: 0,
      shelf: "",
      rack: "",
      condition: "Active",
      type: "Circulating",
      source: "Purchase",
      donorName: "",
      purchaseDate: "",
    });
  };

  const handleRepaymentSubmit = (mode: string, details: any) => {
    if (!selectedMissingRecord) return;

    const updatedRecord = {
      ...selectedMissingRecord,
      repaymentMode: mode,
      ...(mode === 'book' && { replacementBook: details.book }),
      ...(mode === 'cash' && { fineAmount: details.amount }),
      receiptGenerated: true,
    };

    setMissingRecords(prev => prev.map(record => 
      record.id === selectedMissingRecord.id ? updatedRecord : record
    ));

    if (mode === 'book') {
      // Add replacement book
      const replacementBook: Book = {
        ...details.book,
        id: Date.now().toString(),
        bookNumber: selectedMissingRecord.book.bookNumber,
        addedDate: new Date().toISOString().split('T')[0],
        condition: "Active",
        isIssued: false,
      };
      setBooks(prev => [...prev, replacementBook]);
    }

    setIsRepaymentDialogOpen(false);
    setSelectedMissingRecord(null);
  };

  const generateReceipt = (record: MissingBookRecord) => {
    const receiptContent = `
      LIBRARY MANAGEMENT SYSTEM
      ========================
      
      MISSING BOOK REPAYMENT RECEIPT
      
      Date: ${new Date().toLocaleDateString()}
      Receipt No: RCP${Date.now()}
      
      Book Details:
      - Title: ${record.book.title}
      - Book Number: ${record.book.bookNumber}
      - Author: ${record.book.author}
      - Original Price: ₹${record.book.price}
      
      Missing Person:
      - Type: ${record.missingPersonType}
      - Name: ${record.missingPersonDetails.name}
      ${record.missingPersonType === 'Student' ? 
        `- Class: ${record.missingPersonDetails.class}
         - Roll No: ${record.missingPersonDetails.rollNo}` :
        record.missingPersonType === 'Teacher' ?
        `- Subject: ${record.missingPersonDetails.subject}
         - Staff Room: ${record.missingPersonDetails.staffRoom}` :
        `- Designation: ${record.missingPersonDetails.designation}`
      }
      
      Repayment Mode: ${record.repaymentMode?.toUpperCase()}
      ${record.repaymentMode === 'cash' ? 
        `Fine Amount: ₹${record.fineAmount}` :
        `Replacement Book Provided`
      }
      
      Transaction Number: _______________
      (To be filled by Cash Counter)
      
      ================================
      Please submit this receipt to the Cash Counter
      for final processing.
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.bookNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || book.type.toLowerCase() === filterType;
    const matchesCondition = filterCondition === "all" || book.condition.toLowerCase() === filterCondition;
    const matchesTab = activeTab === "all" || book.condition.toLowerCase() === activeTab;
    
    return matchesSearch && matchesType && matchesCondition && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Book Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    placeholder="Enter book title"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={newBook.genre}
                    onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                    placeholder="Enter genre"
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                    placeholder="Enter publisher"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    placeholder="Enter ISBN"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newBook.price}
                    onChange={(e) => setNewBook({...newBook, price: Number(e.target.value)})}
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="shelf">Shelf</Label>
                  <Input
                    id="shelf"
                    value={newBook.shelf}
                    onChange={(e) => setNewBook({...newBook, shelf: e.target.value})}
                    placeholder="A, B, C..."
                  />
                </div>
                <div>
                  <Label htmlFor="rack">Rack</Label>
                  <Input
                    id="rack"
                    value={newBook.rack}
                    onChange={(e) => setNewBook({...newBook, rack: e.target.value})}
                    placeholder="1, 2, 3..."
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={newBook.condition} onValueChange={(value) => setNewBook({...newBook, condition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Obsolete">Obsolete</SelectItem>
                      <SelectItem value="Missing">Missing</SelectItem>
                      <SelectItem value="Binding">Binding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newBook.type} onValueChange={(value) => setNewBook({...newBook, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Circulating">Circulating</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={newBook.source} onValueChange={(value) => setNewBook({...newBook, source: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Donation">Donation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newBook.source === "Donation" && (
                <div>
                  <Label htmlFor="donorName">Donor Name</Label>
                  <Input
                    id="donorName"
                    value={newBook.donorName}
                    onChange={(e) => setNewBook({...newBook, donorName: e.target.value})}
                    placeholder="Enter donor name"
                  />
                </div>
              )}

              {newBook.source === "Purchase" && (
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={newBook.purchaseDate}
                    onChange={(e) => setNewBook({...newBook, purchaseDate: e.target.value})}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBook}>
                  Add Book
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="circulating">Circulating</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="obsolete">Obsolete</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="binding">Binding</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different book conditions */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="obsolete">Obsolete</TabsTrigger>
          <TabsTrigger value="binding">Binding</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Books List */}
          <div className="grid gap-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Book #:</span> {book.bookNumber}
                        </div>
                        <div>
                          <span className="font-medium">Genre:</span> {book.genre}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {book.shelf}-{book.rack}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ₹{book.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={book.type === "Circulating" ? "default" : "secondary"}>
                          {book.type}
                        </Badge>
                        <Badge variant={book.condition === "Active" ? "default" : "destructive"}>
                          {book.condition}
                        </Badge>
                        {book.isIssued && (
                          <Badge variant="outline" className="text-yellow-600">
                            Issued
                          </Badge>
                        )}
                      </div>

                      {book.isIssued && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4" />
                            <span className="font-medium">Borrowed by:</span> {book.borrower}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Issued: {book.issueDate}</span>
                            <span>Due: {book.dueDate}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* Active Books */}
          <div className="grid gap-4">
            {filteredBooks.filter(book => book.condition === "Active").map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Book #:</span> {book.bookNumber}
                        </div>
                        <div>
                          <span className="font-medium">Genre:</span> {book.genre}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {book.shelf}-{book.rack}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ₹{book.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default">Active</Badge>
                        <Badge variant={book.type === "Circulating" ? "default" : "secondary"}>
                          {book.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="obsolete" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Obsolete Books</h2>
            <p className="text-muted-foreground">Books that are no longer in use or outdated.</p>
          </div>
          
          <div className="grid gap-4">
            {filteredBooks.filter(book => book.condition === "Obsolete").map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-orange-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Book #:</span> {book.bookNumber}
                        </div>
                        <div>
                          <span className="font-medium">Added:</span> {book.addedDate}
                        </div>
                        <div>
                          <span className="font-medium">Original Price:</span> ₹{book.price}
                        </div>
                        <div>
                          <span className="font-medium">Publisher:</span> {book.publisher}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Obsolete</Badge>
                        <Badge variant="secondary">{book.type}</Badge>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800">
                          This book has been marked as obsolete and is no longer available for circulation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="binding" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Books in Binding</h2>
            <p className="text-muted-foreground">Books currently sent for binding or repair work.</p>
          </div>
          
          <div className="grid gap-4">
            {filteredBooks.filter(book => book.condition === "Binding").map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Book #:</span> {book.bookNumber}
                        </div>
                        <div>
                          <span className="font-medium">Sent Date:</span> {book.addedDate}
                        </div>
                        <div>
                          <span className="font-medium">Expected Return:</span> TBD
                        </div>
                        <div>
                          <span className="font-medium">Binding Cost:</span> ₹50 (Est.)
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Binding</Badge>
                        <Badge variant="outline">{book.type}</Badge>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          This book is currently at the bindery for repair work. It will be available once the binding is complete.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-green-600">
                        Mark Returned
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="missing" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Missing Books</h2>
            <p className="text-muted-foreground">Books that are reported missing and require repayment or replacement.</p>
          </div>
          
          <div className="grid gap-4">
            {missingRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-red-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{record.book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {record.book.author}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Book #:</span> {record.book.bookNumber}
                        </div>
                        <div>
                          <span className="font-medium">Reported:</span> {record.reportedDate}
                        </div>
                        <div>
                          <span className="font-medium">Book Price:</span> ₹{record.book.price}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {record.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Missing</Badge>
                        <Badge variant="outline">{record.book.type}</Badge>
                        {record.status === 'resolved' && (
                          <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>
                        )}
                      </div>

                      {/* Missing Person Details */}
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-medium text-red-800 mb-2">Missing Person Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Type:</span> {record.missingPersonType}
                          </div>
                          <div>
                            <span className="font-medium">Name:</span> {record.missingPersonDetails.name}
                          </div>
                          {record.missingPersonType === 'Student' && (
                            <>
                              <div>
                                <span className="font-medium">Class:</span> {record.missingPersonDetails.class}
                              </div>
                              <div>
                                <span className="font-medium">Roll No:</span> {record.missingPersonDetails.rollNo}
                              </div>
                            </>
                          )}
                          {record.missingPersonType === 'Teacher' && (
                            <>
                              <div>
                                <span className="font-medium">Subject:</span> {record.missingPersonDetails.subject}
                              </div>
                              <div>
                                <span className="font-medium">Staff Room:</span> {record.missingPersonDetails.staffRoom}
                              </div>
                            </>
                          )}
                          {record.missingPersonType === 'Non-Teaching' && (
                            <div>
                              <span className="font-medium">Designation:</span> {record.missingPersonDetails.designation}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Repayment Information */}
                      {record.repaymentMode && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-800 mb-2">Repayment Information</h4>
                          <div className="text-sm">
                            <div>
                              <span className="font-medium">Mode:</span> {record.repaymentMode}
                            </div>
                            {record.repaymentMode === 'cash' && (
                              <div>
                                <span className="font-medium">Amount:</span> ₹{record.fineAmount}
                              </div>
                            )}
                            {record.repaymentMode === 'book' && (
                              <div>
                                <span className="font-medium">Replacement:</span> New book added with same ID
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {record.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedMissingRecord(record);
                            setIsRepaymentDialogOpen(true);
                          }}
                        >
                          Process Repayment
                        </Button>
                      )}
                      {record.receiptGenerated && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateReceipt(record)}
                        >
                          <Printer className="w-4 h-4 mr-1" />
                          Print Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Repayment Dialog */}
      <RepaymentDialog 
        isOpen={isRepaymentDialogOpen}
        onClose={() => setIsRepaymentDialogOpen(false)}
        record={selectedMissingRecord}
        onSubmit={handleRepaymentSubmit}
      />

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Repayment Dialog Component
const RepaymentDialog = ({ isOpen, onClose, record, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  record: MissingBookRecord | null;
  onSubmit: (mode: string, details: any) => void;
}) => {
  const [repaymentMode, setRepaymentMode] = useState('');
  const [replacementBook, setReplacementBook] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    price: 0,
  });

  if (!record) return null;

  const handleSubmit = () => {
    if (repaymentMode === 'cash') {
      const fineAmount = record.book.price + 50;
      onSubmit('cash', { amount: fineAmount });
    } else if (repaymentMode === 'book') {
      onSubmit('book', { book: replacementBook });
    }
    setRepaymentMode('');
    setReplacementBook({ title: '', author: '', publisher: '', isbn: '', price: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Repayment for Missing Book</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Missing Book Details</h4>
            <p><span className="font-medium">Title:</span> {record.book.title}</p>
            <p><span className="font-medium">Original Price:</span> ₹{record.book.price}</p>
            <p><span className="font-medium">Missing Person:</span> {record.missingPersonDetails.name} ({record.missingPersonType})</p>
          </div>

          <div>
            <Label>Repayment Mode</Label>
            <Select value={repaymentMode} onValueChange={setRepaymentMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select repayment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash Payment</SelectItem>
                <SelectItem value="book">Replacement Book</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {repaymentMode === 'cash' && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Cash Payment Details</h4>
              <p className="text-sm">
                Book Price: ₹{record.book.price}<br/>
                Processing Fee: ₹50<br/>
                <span className="font-bold">Total Amount: ₹{record.book.price + 50}</span>
              </p>
            </div>
          )}

          {repaymentMode === 'book' && (
            <div className="space-y-4">
              <h4 className="font-medium">Replacement Book Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input 
                    value={replacementBook.title}
                    onChange={(e) => setReplacementBook({...replacementBook, title: e.target.value})}
                    placeholder="Enter book title"
                  />
                </div>
                <div>
                  <Label>Author</Label>
                  <Input 
                    value={replacementBook.author}
                    onChange={(e) => setReplacementBook({...replacementBook, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <Label>Publisher</Label>
                  <Input 
                    value={replacementBook.publisher}
                    onChange={(e) => setReplacementBook({...replacementBook, publisher: e.target.value})}
                    placeholder="Enter publisher"
                  />
                </div>
                <div>
                  <Label>ISBN</Label>
                  <Input 
                    value={replacementBook.isbn}
                    onChange={(e) => setReplacementBook({...replacementBook, isbn: e.target.value})}
                    placeholder="Enter ISBN"
                  />
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input 
                    type="number"
                    value={replacementBook.price}
                    onChange={(e) => setReplacementBook({...replacementBook, price: Number(e.target.value)})}
                    placeholder="Enter price"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: The replacement book will be added with the same book number as the missing book.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!repaymentMode || (repaymentMode === 'book' && !replacementBook.title)}
            >
              Process & Generate Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

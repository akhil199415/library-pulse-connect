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
import { useSettings } from "@/contexts/SettingsContext";

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
  invoiceNumber?: string;
  addedDate: string;
  isIssued: boolean;
  borrower?: string;
  borrowerType?: string;
  borrowerDetails?: any;
  issueDate?: string;
  dueDate?: string;
}

export const BookManagement = () => {
  const { genres } = useSettings();
  
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
      invoiceNumber: "INV001",
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

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteIsbn, setDeleteIsbn] = useState("");
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

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
    invoiceNumber: "",
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
      invoiceNumber: "",
    });
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBook = () => {
    if (!selectedBook) return;
    
    setBooks(books.map(book => 
      book.id === selectedBook.id ? selectedBook : book
    ));
    setShowEditSuccess(true);
    setTimeout(() => {
      setShowEditSuccess(false);
      setIsEditDialogOpen(false);
    }, 2000);
  };

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBook = () => {
    if (!selectedBook) return;
    
    setBooks(books.filter(book => book.id !== selectedBook.id));
    setShowDeleteSuccess(true);
    setTimeout(() => {
      setShowDeleteSuccess(false);
      setIsDeleteDialogOpen(false);
      setDeleteIsbn("");
    }, 2000);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.bookNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || book.type.toLowerCase() === filterType;
    const matchesCondition = filterCondition === "all" || book.condition.toLowerCase() === filterCondition;
    const matchesGenre = filterGenre === "all" || book.genre.toLowerCase() === filterGenre;
    const matchesTab = activeTab === "all" || book.condition.toLowerCase() === activeTab;
    
    let matchesDate = true;
    if (dateFrom && dateTo) {
      const bookDate = new Date(book.addedDate);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      matchesDate = bookDate >= fromDate && bookDate <= toDate;
    }
    
    return matchesSearch && matchesType && matchesCondition && matchesGenre && matchesTab && matchesDate;
  });

  const isDeleteEnabled = deleteIsbn === selectedBook?.isbn;

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
                  <Select 
                    value={newBook.genre} 
                    onValueChange={(value) => setNewBook({...newBook, genre: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.name}>{genre.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="None">None</SelectItem>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newBook.purchaseDate}
                      onChange={(e) => setNewBook({...newBook, purchaseDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={newBook.invoiceNumber}
                      onChange={(e) => setNewBook({...newBook, invoiceNumber: e.target.value})}
                      placeholder="Enter invoice number"
                    />
                  </div>
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

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name.toLowerCase()}>{genre.name}</SelectItem>
                ))}
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
            <div>
              <Label htmlFor="dateFrom" className="text-xs block mb-1">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-xs block mb-1">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setFilterGenre("all");
              setFilterCondition("all");
              setDateFrom("");
              setDateTo("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books List with Edit/Delete */}
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
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditBook(book)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteBook(book)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          
          {showEditSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-green-800 font-medium">Changes saved successfully!</div>
            </div>
          )}

          {selectedBook && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Author</Label>
                  <Input
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateBook}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          
          {showDeleteSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-800 font-medium">Book deleted successfully!</div>
            </div>
          ) : (
            selectedBook && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 mb-2">Are you sure you want to delete this book?</p>
                  <div className="text-sm">
                    <p><strong>Title:</strong> {selectedBook.title}</p>
                    <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Enter ISBN to confirm deletion</Label>
                  <Input
                    value={deleteIsbn}
                    onChange={(e) => setDeleteIsbn(e.target.value)}
                    placeholder="Type the ISBN to confirm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={confirmDeleteBook}
                    disabled={!isDeleteEnabled}
                  >
                    Delete Book
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>

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

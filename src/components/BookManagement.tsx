
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, BookOpen, Calendar, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  issueDate?: string;
  dueDate?: string;
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
      condition: "Active",
      type: "Reference",
      source: "Donation",
      donorName: "Alumni Association",
      addedDate: "2024-02-10",
      isIssued: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.bookNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || book.type.toLowerCase() === filterType;
    const matchesCondition = filterCondition === "all" || book.condition.toLowerCase() === filterCondition;
    
    return matchesSearch && matchesType && matchesCondition;
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

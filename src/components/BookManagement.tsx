import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCard } from "./book-management/BookCard";
import { BookFilters } from "./book-management/BookFilters";
import { AddBookDialog } from "./book-management/AddBookDialog";
import { RepaymentDialog } from "./book-management/RepaymentDialog";
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterCondition("all");
  };

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
        </Dialog>
      </div>

      <BookFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCondition={filterCondition}
        setFilterCondition={setFilterCondition}
        onClearFilters={handleClearFilters}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="obsolete">Obsolete</TabsTrigger>
          <TabsTrigger value="binding">Binding</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {filteredBooks.filter(book => book.condition === "Active").map((book) => (
              <BookCard key={book.id} book={book} />
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
              <BookCard key={book.id} book={book} />
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
              <BookCard key={book.id} book={book} />
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
              <MissingBookCard
                key={record.id}
                record={record}
                onProcessRepayment={(record) => {
                  setSelectedMissingRecord(record);
                  setIsRepaymentDialogOpen(true);
                }}
                onGenerateReceipt={generateReceipt}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddBookDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        newBook={newBook}
        setNewBook={setNewBook}
        onAddBook={handleAddBook}
      />

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

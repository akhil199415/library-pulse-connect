
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

interface NewBook {
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
  donorName: string;
  purchaseDate: string;
}

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newBook: NewBook;
  setNewBook: (book: NewBook) => void;
  onAddBook: () => void;
}

export const AddBookDialog = ({ isOpen, onClose, newBook, setNewBook, onAddBook }: AddBookDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onAddBook}>
              Add Book
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

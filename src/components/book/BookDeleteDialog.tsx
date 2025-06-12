
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
}

interface BookDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onDeleteBook: (bookId: string) => void;
}

export const BookDeleteDialog = ({ isOpen, onClose, book, onDeleteBook }: BookDeleteDialogProps) => {
  const [enteredIsbn, setEnteredIsbn] = useState("");
  const [error, setError] = useState("");

  const handleDelete = () => {
    if (!book) return;
    
    if (enteredIsbn !== book.isbn) {
      setError("ISBN does not match. Please enter the correct ISBN.");
      return;
    }

    onDeleteBook(book.id);
    setEnteredIsbn("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setEnteredIsbn("");
    setError("");
    onClose();
  };

  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">
              Are you sure you want to delete this book?
            </p>
            <div className="text-sm text-red-700">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="isbnConfirm">Enter ISBN to confirm deletion *</Label>
            <Input
              id="isbnConfirm"
              value={enteredIsbn}
              onChange={(e) => {
                setEnteredIsbn(e.target.value);
                setError("");
              }}
              placeholder="Enter ISBN number"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={!enteredIsbn.trim() || enteredIsbn !== book.isbn}
            >
              Delete Book
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

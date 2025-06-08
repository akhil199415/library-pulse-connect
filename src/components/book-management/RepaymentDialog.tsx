
import { useState } from "react";
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

interface RepaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: MissingBookRecord | null;
  onSubmit: (mode: string, details: any) => void;
}

export const RepaymentDialog = ({ isOpen, onClose, record, onSubmit }: RepaymentDialogProps) => {
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

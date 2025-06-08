
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Trash2, User, Printer } from "lucide-react";

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

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  onMarkReturned?: (book: Book) => void;
}

export const BookCard = ({ book, onEdit, onDelete, onMarkReturned }: BookCardProps) => {
  const getCardBorderClass = () => {
    switch (book.condition) {
      case "Obsolete": return "border-orange-200";
      case "Binding": return "border-blue-200";
      case "Missing": return "border-red-200";
      default: return "";
    }
  };

  const getIconColor = () => {
    switch (book.condition) {
      case "Obsolete": return "text-orange-600";
      case "Binding": return "text-blue-600";
      case "Missing": return "text-red-600";
      default: return "text-primary";
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${getCardBorderClass()}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <BookOpen className={`w-5 h-5 ${getIconColor()}`} />
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

            {book.condition === "Obsolete" && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  This book has been marked as obsolete and is no longer available for circulation.
                </p>
              </div>
            )}

            {book.condition === "Binding" && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  This book is currently at the bindery for repair work. It will be available once the binding is complete.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {book.condition === "Binding" && onMarkReturned && (
              <Button variant="outline" size="sm" className="text-green-600" onClick={() => onMarkReturned(book)}>
                Mark Returned
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onEdit?.(book)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete?.(book)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

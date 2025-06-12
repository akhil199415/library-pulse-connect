
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/contexts/SettingsContext";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publicationYear: string;
  price: number;
  location: string;
  source: string;
  invoiceNumber?: string;
  purchaseDate: string;
  status: "available" | "issued" | "damaged" | "lost";
  bookNumber: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
}

interface BookEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onUpdateBook: (book: Book) => void;
}

export const BookEditDialog = ({ isOpen, onClose, book, onUpdateBook }: BookEditDialogProps) => {
  const { genres } = useSettings();
  const [formData, setFormData] = useState<Book | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData({ ...book });
    }
  }, [book]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData?.isbn?.trim()) errors.isbn = "ISBN is required *";
    if (!formData?.title?.trim()) errors.title = "Title is required *";
    if (!formData?.author?.trim()) errors.author = "Author is required *";
    if (!formData?.genre?.trim()) errors.genre = "Genre is required *";
    if (!formData?.publisher?.trim()) errors.publisher = "Publisher is required *";
    if (!formData?.publicationYear?.trim()) errors.publicationYear = "Publication Year is required *";
    if (!formData?.price || formData.price <= 0) errors.price = "Valid price is required *";
    if (!formData?.location?.trim()) errors.location = "Location is required *";
    if (!formData?.source?.trim()) errors.source = "Source is required *";
    if (!formData?.purchaseDate?.trim()) errors.purchaseDate = "Purchase Date is required *";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!formData || !validateForm()) return;

    onUpdateBook(formData);
    onClose();
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({...formData, isbn: e.target.value})}
              className={validationErrors.isbn ? "border-red-500" : ""}
            />
            {validationErrors.isbn && <p className="text-red-500 text-sm mt-1">{validationErrors.isbn}</p>}
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={validationErrors.title ? "border-red-500" : ""}
            />
            {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
          </div>

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className={validationErrors.author ? "border-red-500" : ""}
            />
            {validationErrors.author && <p className="text-red-500 text-sm mt-1">{validationErrors.author}</p>}
          </div>

          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
              <SelectTrigger className={validationErrors.genre ? "border-red-500" : ""}>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.genre && <p className="text-red-500 text-sm mt-1">{validationErrors.genre}</p>}
          </div>

          <div>
            <Label htmlFor="publisher">Publisher *</Label>
            <Input
              id="publisher"
              value={formData.publisher}
              onChange={(e) => setFormData({...formData, publisher: e.target.value})}
              className={validationErrors.publisher ? "border-red-500" : ""}
            />
            {validationErrors.publisher && <p className="text-red-500 text-sm mt-1">{validationErrors.publisher}</p>}
          </div>

          <div>
            <Label htmlFor="publicationYear">Publication Year *</Label>
            <Input
              id="publicationYear"
              value={formData.publicationYear}
              onChange={(e) => setFormData({...formData, publicationYear: e.target.value})}
              className={validationErrors.publicationYear ? "border-red-500" : ""}
            />
            {validationErrors.publicationYear && <p className="text-red-500 text-sm mt-1">{validationErrors.publicationYear}</p>}
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              className={validationErrors.price ? "border-red-500" : ""}
            />
            {validationErrors.price && <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>}
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className={validationErrors.location ? "border-red-500" : ""}
            />
            {validationErrors.location && <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>}
          </div>

          <div>
            <Label htmlFor="source">Source *</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
              <SelectTrigger className={validationErrors.source ? "border-red-500" : ""}>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Donation">Donation</SelectItem>
                <SelectItem value="Exchange">Exchange</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.source && <p className="text-red-500 text-sm mt-1">{validationErrors.source}</p>}
          </div>

          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber || ""}
              onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
              className={validationErrors.purchaseDate ? "border-red-500" : ""}
            />
            {validationErrors.purchaseDate && <p className="text-red-500 text-sm mt-1">{validationErrors.purchaseDate}</p>}
          </div>

          <div>
            <Label htmlFor="totalCopies">Total Copies</Label>
            <Input
              id="totalCopies"
              type="number"
              value={formData.totalCopies}
              onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

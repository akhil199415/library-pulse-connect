
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/contexts/SettingsContext";

interface BookEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  book: any;
  onUpdateBook: (updatedBook: any) => void;
}

export const BookEditDialog = ({ isOpen, onClose, book, onUpdateBook }: BookEditDialogProps) => {
  const { genres, languages, publishers } = useSettings();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    bookNumberField: "",
    title: "",
    author: "",
    language: "",
    genre: "",
    publisher: "",
    price: 0,
    shelf: "",
    rack: "",
    condition: "",
    type: "",
    source: "",
    invoiceNumber: "",
    purchaseDate: "",
    donorName: ""
  });

  useEffect(() => {
    if (book) {
      setFormData({
        bookNumberField: book.bookNumberField || "",
        title: book.title || "",
        author: book.author || "",
        language: book.language || "",
        genre: book.genre || "",
        publisher: book.publisher || "",
        price: book.price || 0,
        shelf: book.shelf || "",
        rack: book.rack || "",
        condition: book.condition || "",
        type: book.type || "",
        source: book.source || "",
        invoiceNumber: book.invoiceNumber || "",
        purchaseDate: book.purchaseDate || "",
        donorName: book.donorName || ""
      });
    }
  }, [book]);

  const handleSave = () => {
    const updatedBook = {
      ...book,
      ...formData
    };

    onUpdateBook(updatedBook);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Changes Saved Successfully!</h3>
            <p className="text-green-600">The book information has been updated.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.name}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre *</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({...formData, genre: value})}>
                <SelectTrigger>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publisher">Publisher *</Label>
              <Select value={formData.publisher} onValueChange={(value) => setFormData({...formData, publisher: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select publisher" />
                </SelectTrigger>
                <SelectContent>
                  {publishers.map((publisher) => (
                    <SelectItem key={publisher.id} value={publisher.name}>
                      {publisher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bookNumber">Book Number *</Label>
              <Input
                id="bookNumber"
                value={formData.bookNumberField}
                onChange={(e) => setFormData({...formData, bookNumberField: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="shelf">Shelf</Label>
                <Input
                  id="shelf"
                  value={formData.shelf}
                  onChange={(e) => setFormData({...formData, shelf: e.target.value})}
                  placeholder="A, B, C..."
                />
              </div>
              <div>
                <Label htmlFor="rack">Rack</Label>
                <Input
                  id="rack"
                  value={formData.rack}
                  onChange={(e) => setFormData({...formData, rack: e.target.value})}
                  placeholder="1, 2, 3..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Obsolete">Obsolete</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                  <SelectItem value="Binding">Binding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Circulating">Circulating</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source">Source *</Label>
              <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Donation">Donation</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.source === "Donation" && (
            <div>
              <Label htmlFor="donorName">Donor Name</Label>
              <Input
                id="donorName"
                value={formData.donorName}
                onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                placeholder="Enter donor name"
              />
            </div>
          )}

          {formData.source === "Purchase" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  placeholder="Enter invoice number"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: any) => void;
}

export const AddBookDialog = ({ isOpen, onClose, onAddBook }: AddBookDialogProps) => {
  const { genres, languages } = useSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    language: "",
    genre: "",
    publisher: "",
    publicationYear: "",
    price: 0,
    location: "",
    condition: "",
    type: "",
    source: "",
    invoiceNumber: "",
    purchaseDate: "",
    totalCopies: 1,
    description: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.isbn?.trim()) errors.isbn = "ISBN is required *";
    if (!formData.title?.trim()) errors.title = "Title is required *";
    if (!formData.author?.trim()) errors.author = "Author is required *";
    if (!formData.genre?.trim()) errors.genre = "Genre is required *";
    if (!formData.publisher?.trim()) errors.publisher = "Publisher is required *";
    if (!formData.condition?.trim()) errors.condition = "Condition is required *";
    if (!formData.type?.trim()) errors.type = "Type is required *";
    if (!formData.source?.trim()) errors.source = "Source is required *";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return formData.isbn?.trim() && 
           formData.title?.trim() && 
           formData.author?.trim() && 
           formData.genre?.trim() && 
           formData.publisher?.trim() && 
           formData.condition?.trim() && 
           formData.type?.trim() && 
           formData.source?.trim();
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newBook = {
      ...formData,
      id: Date.now().toString(),
      bookNumber: `BK${Date.now().toString().slice(-6)}`,
      status: "available",
      availableCopies: formData.totalCopies
    };

    onAddBook(newBook);
    setFormData({
      isbn: "",
      title: "",
      author: "",
      language: "",
      genre: "",
      publisher: "",
      publicationYear: "",
      price: 0,
      location: "",
      condition: "",
      type: "",
      source: "",
      invoiceNumber: "",
      purchaseDate: "",
      totalCopies: 1,
      description: ""
    });
    setValidationErrors({});
    onClose();

    toast({
      title: "Success",
      description: "Book added successfully!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
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
            <Label htmlFor="publicationYear">Publication Year</Label>
            <Input
              id="publicationYear"
              value={formData.publicationYear}
              onChange={(e) => setFormData({...formData, publicationYear: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
              <SelectTrigger className={validationErrors.condition ? "border-red-500" : ""}>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.condition && <p className="text-red-500 text-sm mt-1">{validationErrors.condition}</p>}
          </div>

          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger className={validationErrors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Textbook">Textbook</SelectItem>
                <SelectItem value="Reference">Reference</SelectItem>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                <SelectItem value="Journal">Journal</SelectItem>
                <SelectItem value="Magazine">Magazine</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.type && <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>}
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
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            />
          </div>

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
            <Label htmlFor="totalCopies">Total Copies</Label>
            <Input
              id="totalCopies"
              type="number"
              value={formData.totalCopies}
              onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value) || 1})}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            Add Book
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

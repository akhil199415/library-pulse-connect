import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, ArrowRight, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppMessaging } from "@/components/WhatsAppMessaging";
import { OverdueFineReceipt } from "@/components/OverdueFineReceipt";
import { CirculationFilters } from "@/components/circulation/CirculationFilters";

interface Circulation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookNumber: string;
  memberId: string;
  memberName: string;
  memberCategory: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: "issued" | "returned" | "overdue";
  fine: number;
}

export const CirculationSystem = () => {
  const { toast } = useToast();
  const [circulations, setCirculations] = useState<Circulation[]>([
    {
      id: "1",
      bookId: "1",
      bookTitle: "Introduction to Computer Science",
      bookNumber: "BK001234",
      memberId: "STU001234",
      memberName: "Emily Parker",
      memberCategory: "Student",
      issueDate: "2024-05-20",
      dueDate: "2024-06-03",
      status: "issued",
      fine: 0,
    },
    {
      id: "2",
      bookId: "3",
      bookTitle: "Advanced Mathematics",
      bookNumber: "BK001236",
      memberId: "STU001234",
      memberName: "Emily Parker",
      memberCategory: "Student",
      issueDate: "2024-05-18",
      dueDate: "2024-06-01",
      status: "overdue",
      fine: 5,
    },
    {
      id: "3",
      bookId: "4",
      bookTitle: "Physics Fundamentals",
      bookNumber: "BK001237",
      memberId: "TCH001567",
      memberName: "Dr. Michael Brown",
      memberCategory: "Teaching Staff",
      issueDate: "2024-05-15",
      dueDate: "2024-05-29",
      status: "returned",
      returnDate: "2024-05-28",
      fine: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isOverdueFineDialogOpen, setIsOverdueFineDialogOpen] = useState(false);
  const [selectedOverdueCirculation, setSelectedOverdueCirculation] = useState<Circulation | null>(null);

  const [issueForm, setIssueForm] = useState({
    bookNumber: "",
    memberId: "",
  });

  const [returnForm, setReturnForm] = useState({
    bookNumber: "",
  });

  const calculateFine = (dueDate: string, returnDate?: string) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const diffTime = returned.getTime() - due.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return diffDays > 7 ? (diffDays - 7) * 1 : 0;
  };

  const getDueDate = (issueDate: string) => {
    const issue = new Date(issueDate);
    issue.setDate(issue.getDate() + 14);
    return issue.toISOString().split('T')[0];
  };

  const handleIssueBook = () => {
    if (!issueForm.bookNumber || !issueForm.memberId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCirculation: Circulation = {
      id: Date.now().toString(),
      bookId: "new_book_id",
      bookTitle: "Sample Book Title",
      bookNumber: issueForm.bookNumber,
      memberId: issueForm.memberId,
      memberName: "Sample Member",
      memberCategory: "Student",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: getDueDate(new Date().toISOString().split('T')[0]),
      status: "issued",
      fine: 0,
    };

    setCirculations([newCirculation, ...circulations]);
    setIsIssueDialogOpen(false);
    setIssueForm({ bookNumber: "", memberId: "" });
    
    toast({
      title: "Success",
      description: "Book issued successfully!",
    });
  };

  const handleReturnBook = () => {
    if (!returnForm.bookNumber) {
      toast({
        title: "Error",
        description: "Please enter book number",
        variant: "destructive",
      });
      return;
    }

    const circulation = circulations.find(c => 
      c.bookNumber === returnForm.bookNumber && c.status !== "returned"
    );

    if (!circulation) {
      toast({
        title: "Error",
        description: "Book not found or already returned",
        variant: "destructive",
      });
      return;
    }

    if (circulation.status === "overdue" && circulation.fine > 0) {
      setSelectedOverdueCirculation(circulation);
      setIsOverdueFineDialogOpen(true);
      setIsReturnDialogOpen(false);
      return;
    }

    const returnDate = new Date().toISOString().split('T')[0];
    const fine = calculateFine(circulation.dueDate, returnDate);

    setCirculations(circulations.map(c => 
      c.id === circulation.id 
        ? { ...c, status: "returned" as const, returnDate, fine }
        : c
    ));

    setIsReturnDialogOpen(false);
    setReturnForm({ bookNumber: "" });
    
    toast({
      title: "Success",
      description: fine > 0 ? `Book returned! Fine: ₹${fine}` : "Book returned successfully!",
    });
  };

  const handleOverdueReturn = (circulation: Circulation) => {
    if (circulation.status === "overdue" && circulation.fine > 0) {
      setSelectedOverdueCirculation(circulation);
      setIsOverdueFineDialogOpen(true);
    } else {
      handleRegularReturn(circulation);
    }
  };

  const handleRegularReturn = (circulation: Circulation) => {
    const returnDate = new Date().toISOString().split('T')[0];
    
    setCirculations(circulations.map(c => 
      c.id === circulation.id 
        ? { ...c, status: "returned" as const, returnDate, fine: 0 }
        : c
    ));
    
    toast({
      title: "Success",
      description: "Book returned successfully!",
    });
  };

  const handleReceiptGenerated = (receiptNo: string) => {
    if (selectedOverdueCirculation) {
      const returnDate = new Date().toISOString().split('T')[0];
      
      setCirculations(circulations.map(c => 
        c.id === selectedOverdueCirculation.id 
          ? { ...c, status: "returned" as const, returnDate }
          : c
      ));
      
      toast({
        title: "Success",
        description: `Book returned with receipt #${receiptNo}! Fine: ₹${selectedOverdueCirculation.fine}`,
      });
      
      setSelectedOverdueCirculation(null);
    }
  };

  const handleCancelOverdue = () => {
    if (selectedOverdueCirculation) {
      const returnDate = new Date().toISOString().split('T')[0];
      
      setCirculations(circulations.map(c => 
        c.id === selectedOverdueCirculation.id 
          ? { ...c, status: "returned" as const, returnDate, fine: 0 }
          : c
      ));
      
      toast({
        title: "Success",
        description: "Overdue fine cancelled and book returned successfully!",
      });
      
      setSelectedOverdueCirculation(null);
    }
  };

  const filteredCirculations = circulations.filter(circulation => {
    const matchesSearch = circulation.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circulation.bookNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circulation.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circulation.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || circulation.status === filterStatus;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const issueDate = new Date(circulation.issueDate);
      if (dateFrom) {
        matchesDate = matchesDate && issueDate >= new Date(dateFrom);
      }
      if (dateTo) {
        matchesDate = matchesDate && issueDate <= new Date(dateTo);
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const activeCirculations = filteredCirculations.filter(c => c.status !== "returned");
  const returnedCirculations = filteredCirculations.filter(c => c.status === "returned");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Circulation System</h1>
        <div className="flex gap-2">
          <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" />
                Issue Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue Book</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bookNumber">Book Number *</Label>
                  <Input
                    id="bookNumber"
                    value={issueForm.bookNumber}
                    onChange={(e) => setIssueForm({...issueForm, bookNumber: e.target.value})}
                    placeholder="Enter book number (e.g., BK001234)"
                  />
                </div>
                <div>
                  <Label htmlFor="memberId">Member ID *</Label>
                  <Input
                    id="memberId"
                    value={issueForm.memberId}
                    onChange={(e) => setIssueForm({...issueForm, memberId: e.target.value})}
                    placeholder="Enter member ID (e.g., STU001234)"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleIssueBook}>
                    Issue Book
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Return Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Return Book</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="returnBookNumber">Book Number *</Label>
                  <Input
                    id="returnBookNumber"
                    value={returnForm.bookNumber}
                    onChange={(e) => setReturnForm({...returnForm, bookNumber: e.target.value})}
                    placeholder="Enter book number (e.g., BK001234)"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReturnBook}>
                    Return Book
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CirculationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      {/* Active Circulations with WhatsApp messaging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Active Circulations ({activeCirculations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCirculations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active circulations found
              </div>
            ) : (
              activeCirculations.map((circulation) => (
                <div key={circulation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{circulation.bookTitle}</h4>
                          <p className="text-sm text-muted-foreground">#{circulation.bookNumber}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{circulation.memberName}</p>
                          <p className="text-sm text-muted-foreground">{circulation.memberId} • {circulation.memberCategory}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {circulation.issueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {circulation.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={circulation.status === "overdue" ? "destructive" : "default"}>
                        {circulation.status}
                      </Badge>
                      {circulation.fine > 0 && (
                        <Badge variant="destructive">
                          Fine: ₹{circulation.fine}
                        </Badge>
                      )}
                      <WhatsAppMessaging
                        memberName={circulation.memberName}
                        bookTitle={circulation.bookTitle}
                        dueDate={circulation.dueDate}
                        isOverdue={circulation.status === "overdue"}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOverdueReturn(circulation)}
                      >
                        Return
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Return History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Return History ({returnedCirculations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {returnedCirculations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No return history found
              </div>
            ) : (
              returnedCirculations.map((circulation) => (
                <div key={circulation.id} className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{circulation.bookTitle}</h4>
                          <p className="text-sm text-muted-foreground">#{circulation.bookNumber}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{circulation.memberName}</p>
                          <p className="text-sm text-muted-foreground">{circulation.memberId} • {circulation.memberCategory}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Issued: {circulation.issueDate}</span>
                        <span>Due: {circulation.dueDate}</span>
                        <span>Returned: {circulation.returnDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Returned</Badge>
                      {circulation.fine > 0 && (
                        <Badge variant="destructive">
                          Fine: ₹{circulation.fine}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedOverdueCirculation && (
        <OverdueFineReceipt
          isOpen={isOverdueFineDialogOpen}
          setIsOpen={setIsOverdueFineDialogOpen}
          bookTitle={selectedOverdueCirculation.bookTitle}
          bookNumber={selectedOverdueCirculation.bookNumber}
          memberName={selectedOverdueCirculation.memberName}
          memberId={selectedOverdueCirculation.memberId}
          fineAmount={selectedOverdueCirculation.fine}
          onReceiptGenerated={handleReceiptGenerated}
          onCancelOverdue={handleCancelOverdue}
        />
      )}
    </div>
  );
};

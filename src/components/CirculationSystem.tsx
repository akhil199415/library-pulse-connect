import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CirculationFilters } from "@/components/circulation/CirculationFilters";
import { WhatsAppMessaging } from "@/components/WhatsAppMessaging";

interface CirculationRecord {
  id: string;
  bookTitle: string;
  bookNumber: string;
  memberName: string;
  memberId: string;
  memberPhone: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'issued' | 'returned' | 'overdue' | 'frozen';
  genre: string;
}

const CirculationSystem = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGenre, setFilterGenre] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [records, setRecords] = useState<CirculationRecord[]>([
    {
      id: "1",
      bookTitle: "The Lord of the Rings",
      bookNumber: "12345",
      memberName: "John Doe",
      memberId: "67890",
      memberPhone: "+15551234567",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      returnDate: null,
      status: "issued",
      genre: "Fiction",
    },
    {
      id: "2",
      bookTitle: "Pride and Prejudice",
      bookNumber: "23456",
      memberName: "Jane Smith",
      memberId: "78901",
      memberPhone: "+15552345678",
      issueDate: "2023-12-20",
      dueDate: "2024-01-20",
      returnDate: "2024-01-18",
      status: "returned",
      genre: "Fiction",
    },
    {
      id: "3",
      bookTitle: "The Hitchhiker's Guide to the Galaxy",
      bookNumber: "34567",
      memberName: "Alice Johnson",
      memberId: "89012",
      memberPhone: "+15553456789",
      issueDate: "2024-02-01",
      dueDate: "2024-03-01",
      returnDate: null,
      status: "overdue",
      genre: "Science",
    },
    {
      id: "4",
      bookTitle: "The Silent Patient",
      bookNumber: "45678",
      memberName: "Bob Williams",
      memberId: "90123",
      memberPhone: "+15554567890",
      issueDate: "2024-02-10",
      dueDate: "2024-03-10",
      returnDate: null,
      status: "issued",
      genre: "Fiction",
    },
    {
      id: "5",
      bookTitle: "Sapiens: A Brief History of Humankind",
      bookNumber: "56789",
      memberName: "Emily Brown",
      memberId: "01234",
      memberPhone: "+15555678901",
      issueDate: "2024-01-25",
      dueDate: "2024-02-25",
      returnDate: null,
      status: "issued",
      genre: "Non-Fiction",
    },
  ]);
  const [returnConfirmation, setReturnConfirmation] = useState<{ recordId: string } | null>(null);
  const [freezeConfirmation, setFreezeConfirmation] = useState<{ recordId: string } | null>(null);

  const filteredRecords = records.filter((record) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      record.bookTitle.toLowerCase().includes(searchTermLower) ||
      record.bookNumber.toLowerCase().includes(searchTermLower) ||
      record.memberName.toLowerCase().includes(searchTermLower) ||
      record.memberId.toLowerCase().includes(searchTermLower);

    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;

    const matchesGenre =
      filterGenre === "all" || record.genre === filterGenre;

    const matchesDateRange =
      (!dateFrom || new Date(record.issueDate) >= new Date(dateFrom)) &&
      (!dateTo || new Date(record.issueDate) <= new Date(dateTo));

    return matchesSearch && matchesStatus && matchesGenre && matchesDateRange;
  });

  const confirmReturn = (recordId: string) => {
    setReturnConfirmation({ recordId });
  };

  const returnRecord = (recordId: string) => {
    setRecords(
      records.map((record) =>
        record.id === recordId
          ? { ...record, status: "returned", returnDate: new Date().toISOString().slice(0, 10) }
          : record
      )
    );
    setReturnConfirmation(null);
    toast({
      title: "Success",
      description: "Book returned successfully!",
    });
  };

  const cancelReturn = () => {
    setReturnConfirmation(null);
  };

  const freezeRecord = (recordId: string) => {
    setFreezeConfirmation({ recordId });
  };

  const confirmFreeze = (recordId: string) => {
    setRecords(
      records.map((record) =>
        record.id === recordId ? { ...record, status: "frozen" } : record
      )
    );
    setFreezeConfirmation(null);
    toast({
      title: "Success",
      description: "Record frozen successfully!",
    });
  };

  const cancelFreeze = () => {
    setFreezeConfirmation(null);
  };

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = now.getTime() - due.getTime();
    const daysOverdue = Math.ceil(diff / (1000 * 3600 * 24));
    return daysOverdue > 0 ? daysOverdue * 10 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Circulation System</h1>
      </div>

      <CirculationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      <Card>
        <CardHeader>
          <CardTitle>Circulation Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Book Number</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.bookTitle}</TableCell>
                    <TableCell>{record.bookNumber}</TableCell>
                    <TableCell>{record.memberName}</TableCell>
                    <TableCell>{record.memberId}</TableCell>
                    <TableCell>{record.issueDate}</TableCell>
                    <TableCell>{record.dueDate}</TableCell>
                    <TableCell>{record.returnDate || "N/A"}</TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <WhatsAppMessaging
                          memberName={record.memberName}
                          memberPhone={record.memberPhone}
                          bookTitle={record.bookTitle}
                          dueDate={record.dueDate}
                          isOverdue={record.status === 'overdue'}
                        />
                        {record.status === 'issued' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => freezeRecord(record.id)}
                          >
                            Frozen
                          </Button>
                        )}
                        {record.status === "issued" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => confirmReturn(record.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Return
                          </Button>
                        )}
                        {record.status === "overdue" && (
                          <Button size="sm" variant="destructive">
                            Fine: ${calculateFine(record.dueDate)}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Return Confirmation Dialog */}
      <Dialog open={!!returnConfirmation} onOpenChange={cancelReturn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to return this book?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelReturn}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => returnRecord(returnConfirmation?.recordId || "")}
              >
                Return Book
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Freeze Confirmation Dialog */}
      <Dialog open={!!freezeConfirmation} onOpenChange={cancelFreeze}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Freeze</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to freeze this record?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelFreeze}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmFreeze(freezeConfirmation?.recordId || "")}
              >
                Freeze Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CirculationSystem;

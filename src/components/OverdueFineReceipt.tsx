
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

interface OverdueFineReceiptProps {
  circulation: Circulation;
  isOpen: boolean;
  onClose: () => void;
  onReceiptGenerated: (receiptNo: string) => void;
  onCancelOverdue: () => void;
}

export const OverdueFineReceipt = ({
  circulation,
  isOpen,
  onClose,
  onReceiptGenerated,
  onCancelOverdue,
}: OverdueFineReceiptProps) => {
  const [receiptNo, setReceiptNo] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RCP${timestamp}${random}`;
  };

  const handleGenerateReceipt = () => {
    const generatedReceiptNo = generateReceiptNumber();
    setReceiptNo(generatedReceiptNo);
    setShowReceipt(true);
  };

  const handlePrintReceipt = () => {
    window.print();
    onReceiptGenerated(receiptNo);
    setSuccessMessage(`Receipt #${receiptNo} generated and book returned successfully!`);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose();
    }, 2000);
  };

  const handleCancelOverdue = () => {
    if (!cancelReason.trim()) return;
    
    onCancelOverdue();
    setSuccessMessage("Overdue fine cancelled successfully!");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setReceiptNo("");
    setShowReceipt(false);
    setShowCancelConfirm(false);
    setCancelReason("");
    setShowSuccess(false);
    setSuccessMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showSuccess ? "Success" : showCancelConfirm ? "Cancel Overdue Fine" : showReceipt ? "Overdue Fine Receipt" : "Overdue Fine Payment"}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-800 font-medium text-lg">{successMessage}</div>
          </div>
        ) : showCancelConfirm ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                Are you sure you want to cancel the overdue fine of ₹{circulation.fine}?
              </p>
              <div className="mt-2 text-sm text-yellow-700">
                <p><strong>Book:</strong> {circulation.bookTitle}</p>
                <p><strong>Member:</strong> {circulation.memberName}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="cancelReason">Reason for cancelling overdue fine *</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancelling the overdue fine..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
                Back
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelOverdue}
                disabled={!cancelReason.trim()}
              >
                Cancel Fine
              </Button>
            </div>
          </div>
        ) : showReceipt ? (
          <div className="space-y-4">
            <Card className="border-2 border-gray-300">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold">OVERDUE FINE RECEIPT</h2>
                  <p className="text-sm text-muted-foreground">Receipt No: {receiptNo}</p>
                  <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Book Title:</strong></p>
                    <p>{circulation.bookTitle}</p>
                  </div>
                  <div>
                    <p><strong>Book Number:</strong></p>
                    <p>{circulation.bookNumber}</p>
                  </div>
                  <div>
                    <p><strong>Member Name:</strong></p>
                    <p>{circulation.memberName}</p>
                  </div>
                  <div>
                    <p><strong>Member ID:</strong></p>
                    <p>{circulation.memberId}</p>
                  </div>
                  <div>
                    <p><strong>Due Date:</strong></p>
                    <p>{circulation.dueDate}</p>
                  </div>
                  <div>
                    <p><strong>Return Date:</strong></p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    Fine Amount: ₹{circulation.fine}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Payment received in cash
                  </p>
                </div>
                
                <Separator />
                
                <div className="text-center text-xs text-muted-foreground">
                  <p>Thank you for your payment</p>
                  <p>This is a computer generated receipt</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReceipt(false)}>
                Back
              </Button>
              <Button onClick={handlePrintReceipt}>
                Print & Complete Return
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Overdue Fine Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Book:</strong> {circulation.bookTitle} ({circulation.bookNumber})</p>
                <p><strong>Member:</strong> {circulation.memberName} ({circulation.memberId})</p>
                <p><strong>Due Date:</strong> {circulation.dueDate}</p>
                <p><strong>Fine Amount:</strong> <span className="text-lg font-bold text-red-600">₹{circulation.fine}</span></p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelConfirm(true)}>
                Cancel Overdue Fine
              </Button>
              <Button onClick={handleGenerateReceipt}>
                Generate Receipt
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

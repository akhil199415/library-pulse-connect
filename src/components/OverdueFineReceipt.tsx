
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer, Receipt } from "lucide-react";

interface OverdueFineReceiptProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bookTitle: string;
  bookNumber: string;
  memberName: string;
  memberId: string;
  fineAmount: number;
  onReceiptGenerated: (receiptNo: string) => void;
  onCancelOverdue: (reason: string) => void;
}

export const OverdueFineReceipt = ({
  isOpen,
  setIsOpen,
  bookTitle,
  bookNumber,
  memberName,
  memberId,
  fineAmount,
  onReceiptGenerated,
  onCancelOverdue
}: OverdueFineReceiptProps) => {
  const [receiptNo, setReceiptNo] = useState("");
  const [showReceiptInput, setShowReceiptInput] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);

  const generateReceiptNo = () => {
    const timestamp = Date.now();
    const generatedReceiptNo = `RCP${timestamp}`;
    setReceiptNo(generatedReceiptNo);
    return generatedReceiptNo;
  };

  const handlePrintReceipt = () => {
    const generatedReceiptNo = generateReceiptNo();
    
    // Print logic
    if (receiptRef.current) {
      const printContent = receiptRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Overdue Fine Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { max-width: 400px; margin: 0 auto; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; }
                .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 20px; font-weight: bold; }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
    
    setShowReceiptInput(true);
  };

  const handleConfirmReturn = () => {
    if (receiptNo.trim()) {
      onReceiptGenerated(receiptNo);
      setIsOpen(false);
      setShowReceiptInput(false);
      setReceiptNo("");
    }
  };

  const handleCancelOverdue = () => {
    if (cancelReason.trim()) {
      onCancelOverdue(cancelReason);
      setIsOpen(false);
      setShowReceiptInput(false);
      setReceiptNo("");
      setShowCancelConfirmation(false);
      setCancelReason("");
    }
  };

  const resetDialog = () => {
    setIsOpen(false);
    setShowReceiptInput(false);
    setReceiptNo("");
    setShowCancelConfirmation(false);
    setCancelReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Overdue Fine Receipt</DialogTitle>
        </DialogHeader>
        
        {!showCancelConfirmation ? (
          <>
            <div ref={receiptRef} className="receipt">
              <div className="header">
                <h3 className="text-lg font-bold">Library Fine Receipt</h3>
                <p className="text-sm text-muted-foreground">Overdue Book Return</p>
              </div>
              
              <div className="space-y-3">
                <div className="row">
                  <span>Receipt No:</span>
                  <span className="font-mono">{receiptNo || "___________"}</span>
                </div>
                <div className="row">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="row">
                  <span>Member:</span>
                  <span>{memberName}</span>
                </div>
                <div className="row">
                  <span>Member ID:</span>
                  <span>{memberId}</span>
                </div>
                <div className="row">
                  <span>Book:</span>
                  <span className="text-right">{bookTitle}</span>
                </div>
                <div className="row">
                  <span>Book No:</span>
                  <span>{bookNumber}</span>
                </div>
                <div className="row total">
                  <span>Overdue Fine:</span>
                  <span>₹{fineAmount}</span>
                </div>
              </div>
            </div>

            {!showReceiptInput ? (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => setShowCancelConfirmation(true)}>
                  Cancel Overdue
                </Button>
                <Button onClick={handlePrintReceipt} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Generate & Print Receipt
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="receiptInput">Enter Receipt No *</Label>
                  <Input
                    id="receiptInput"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    placeholder="Enter receipt number"
                    className="font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetDialog}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmReturn}
                    disabled={!receiptNo.trim()}
                    className="gap-2"
                  >
                    <Receipt className="w-4 h-4" />
                    Return Book
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-800">
                Are you sure you want to cancel the overdue of ₹{fineAmount}?
              </p>
            </div>
            <div>
              <Label htmlFor="cancelReason">Reason for cancellation *</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancelling the overdue fine"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelConfirmation(false)}>
                No
              </Button>
              <Button 
                onClick={handleCancelOverdue}
                disabled={!cancelReason.trim()}
                variant="destructive"
              >
                Yes, Cancel Overdue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Receipt, Printer, X } from "lucide-react";

export const OverdueFineReceipt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const overdueDetails = {
    memberName: "John Doe",
    memberId: "STU123456",
    cardNumber: "CARD001",
    bookTitle: "Advanced Mathematics",
    bookNumber: "BK001235",
    issueDate: "2024-05-01",
    dueDate: "2024-05-15",
    returnDate: "2024-05-25",
    overdueDays: 10,
    finePerDay: 5,
    totalFine: 50,
  };

  const handlePrintReceipt = () => {
    if (!receiptNumber.trim()) {
      alert("Please enter a receipt number");
      return;
    }

    const receiptContent = `
╔════════════════════════════════════════════════════════════════╗
║                    LIBRARY MANAGEMENT SYSTEM                  ║
║                    OVERDUE FINE RECEIPT                       ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ Receipt No: ${receiptNumber.padEnd(20, ' ')}Date: ${new Date().toLocaleDateString().padStart(20, ' ')} ║
║                                                                ║
║ Member Details:                                                ║
║ ──────────────────────────────────────────────────────────── ║
║ Name: ${overdueDetails.memberName.padEnd(45, ' ')} ║
║ Member ID: ${overdueDetails.memberId.padEnd(42, ' ')} ║
║ Card Number: ${overdueDetails.cardNumber.padEnd(40, ' ')} ║
║                                                                ║
║ Book Details:                                                  ║
║ ──────────────────────────────────────────────────────────── ║
║ Title: ${overdueDetails.bookTitle.padEnd(44, ' ')} ║
║ Book Number: ${overdueDetails.bookNumber.padEnd(40, ' ')} ║
║ Issue Date: ${overdueDetails.issueDate.padEnd(41, ' ')} ║
║ Due Date: ${overdueDetails.dueDate.padEnd(43, ' ')} ║
║ Return Date: ${overdueDetails.returnDate.padEnd(40, ' ')} ║
║                                                                ║
║ Fine Calculation:                                              ║
║ ──────────────────────────────────────────────────────────── ║
║ Overdue Days: ${String(overdueDetails.overdueDays).padEnd(39, ' ')} ║
║ Fine per Day: ₹${String(overdueDetails.finePerDay).padEnd(38, ' ')} ║
║ Total Fine: ₹${String(overdueDetails.totalFine).padEnd(40, ' ')} ║
║                                                                ║
║ Payment Status: PAID                                           ║
║                                                                ║
║ ────────────────────────────────────────────────────────────  ║
║ Thank you for using our library services!                     ║
║ Please keep this receipt for your records.                    ║
╚════════════════════════════════════════════════════════════════╝
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Overdue Fine Receipt</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                margin: 20px; 
                font-size: 12px;
                line-height: 1.2;
              }
              pre { 
                white-space: pre; 
                font-family: 'Courier New', monospace;
                font-size: 12px;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    setSuccessMessage("Receipt printed successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelOverdue = () => {
    if (!cancelReason.trim()) {
      alert("Please enter a reason for canceling the overdue fine");
      return;
    }

    setShowCancelDialog(false);
    setCancelReason("");
    setSuccessMessage("Overdue fine canceled successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Receipt className="w-4 h-4" />
            Generate Overdue Fine Receipt
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Overdue Fine Receipt</DialogTitle>
          </DialogHeader>
          
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-green-800 font-medium">{successMessage}</div>
            </div>
          )}

          <div className="space-y-6">
            {/* Receipt Preview */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="bg-white p-6 border-2 border-dashed border-gray-300 rounded font-mono text-sm">
                <div className="text-center mb-4 font-bold">
                  <div>LIBRARY MANAGEMENT SYSTEM</div>
                  <div>OVERDUE FINE RECEIPT</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                  <div>Receipt No: {receiptNumber || "___________"}</div>
                  <div className="text-right">Date: {new Date().toLocaleDateString()}</div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="font-semibold mb-1">Member Details:</div>
                    <div className="pl-2 space-y-1">
                      <div>Name: {overdueDetails.memberName}</div>
                      <div>Member ID: {overdueDetails.memberId}</div>
                      <div>Card Number: {overdueDetails.cardNumber}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-1">Book Details:</div>
                    <div className="pl-2 space-y-1">
                      <div>Title: {overdueDetails.bookTitle}</div>
                      <div>Book Number: {overdueDetails.bookNumber}</div>
                      <div>Issue Date: {overdueDetails.issueDate}</div>
                      <div>Due Date: {overdueDetails.dueDate}</div>
                      <div>Return Date: {overdueDetails.returnDate}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-1">Fine Calculation:</div>
                    <div className="pl-2 space-y-1">
                      <div>Overdue Days: {overdueDetails.overdueDays}</div>
                      <div>Fine per Day: ₹{overdueDetails.finePerDay}</div>
                      <div className="font-semibold">Total Fine: ₹{overdueDetails.totalFine}</div>
                    </div>
                  </div>

                  <div className="text-center font-semibold mt-4">
                    Payment Status: PAID
                  </div>
                </div>

                <div className="border-t pt-3 mt-4 text-center text-xs">
                  <div>Thank you for using our library services!</div>
                  <div>Please keep this receipt for your records.</div>
                </div>
              </div>
            </div>

            {/* Receipt Number Input */}
            <div>
              <Label htmlFor="receiptNumber">Receipt Number *</Label>
              <Input
                id="receiptNumber"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Enter receipt number (e.g., RCP001)"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel Overdue
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={handlePrintReceipt}
                  className="gap-2"
                  disabled={!receiptNumber.trim()}
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Overdue Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Overdue Fine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Are you sure you want to cancel the overdue fine? This action cannot be undone.
              </p>
            </div>
            <div>
              <Label htmlFor="cancelReason">Reason for canceling overdue fine *</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter the reason for canceling this overdue fine..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCancelOverdue}
                disabled={!cancelReason.trim()}
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

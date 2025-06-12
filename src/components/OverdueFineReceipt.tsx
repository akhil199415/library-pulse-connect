
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
  isOpen: boolean;
  onClose: () => void;
  circulation: Circulation;
  onReceiptGenerated: (receiptNo: string) => void;
  onCancelOverdue: () => void;
}

export const OverdueFineReceipt = ({
  isOpen,
  onClose,
  circulation,
  onReceiptGenerated,
  onCancelOverdue,
}: OverdueFineReceiptProps) => {
  const [receiptNo, setReceiptNo] = useState("");
  const [cashReceiptNo, setCashReceiptNo] = useState("");
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
    setSuccessMessage(`Receipt #${receiptNo} generated successfully! Please enter receipt number to complete return.`);
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
    setCashReceiptNo("");
    setShowReceipt(false);
    setShowCancelConfirm(false);
    setCancelReason("");
    setShowSuccess(false);
    setSuccessMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
            <div className="bg-white border-2 border-gray-300 rounded-lg p-8 print:shadow-none print:border-black">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">OVERDUE FINE RECEIPT</h2>
                <p className="text-sm text-gray-600 mt-2">Receipt No: {receiptNo}</p>
                <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                <div className="space-y-2">
                  <div>
                    <strong className="text-gray-700">Book Title:</strong>
                    <p className="text-gray-900">{circulation.bookTitle}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Book Number:</strong>
                    <p className="text-gray-900">{circulation.bookNumber}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Issued Date:</strong>
                    <p className="text-gray-900">{circulation.issueDate}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <strong className="text-gray-700">Member Name:</strong>
                    <p className="text-gray-900">{circulation.memberName}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Member ID:</strong>
                    <p className="text-gray-900">{circulation.memberId}</p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Due Date:</strong>
                    <p className="text-gray-900">{circulation.dueDate}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center mb-6">
                <div className="text-xl font-bold text-red-600 mb-2">
                  Fine Amount: ₹{circulation.fine}
                </div>
                <p className="text-sm text-gray-600">
                  Payment received in cash
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center text-xs text-gray-500">
                <p>Thank you for your payment</p>
                <p>This is a computer generated receipt</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReceipt(false)}>
                Back
              </Button>
              <Button onClick={handlePrintReceipt}>
                Print & Download Receipt
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">Overdue Fine Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Book:</strong> {circulation.bookTitle}</p>
                  <p><strong>Book Number:</strong> {circulation.bookNumber}</p>
                  <p><strong>Member:</strong> {circulation.memberName}</p>
                  <p><strong>Member ID:</strong> {circulation.memberId}</p>
                </div>
                <div>
                  <p><strong>Issued Date:</strong> {circulation.issueDate}</p>
                  <p><strong>Due Date:</strong> {circulation.dueDate}</p>
                  <p><strong>Fine Amount:</strong> <span className="text-lg font-bold text-red-600">₹{circulation.fine}</span></p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="cashReceiptNo">Cash Receipt No.</Label>
              <Input
                id="cashReceiptNo"
                value={cashReceiptNo}
                onChange={(e) => setCashReceiptNo(e.target.value)}
                placeholder="Enter cash receipt number"
              />
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

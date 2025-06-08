
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Printer } from "lucide-react";

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

interface MissingBookRecord {
  id: string;
  book: Book;
  missingPersonType: string;
  missingPersonDetails: any;
  reportedDate: string;
  repaymentMode?: string;
  replacementBook?: Book;
  fineAmount?: number;
  transactionNumber?: string;
  receiptGenerated: boolean;
  status: 'pending' | 'resolved';
}

interface MissingBookCardProps {
  record: MissingBookRecord;
  onProcessRepayment: (record: MissingBookRecord) => void;
  onGenerateReceipt: (record: MissingBookRecord) => void;
}

export const MissingBookCard = ({ record, onProcessRepayment, onGenerateReceipt }: MissingBookCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow border-red-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">{record.book.title}</h3>
                <p className="text-sm text-muted-foreground">by {record.book.author}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Book #:</span> {record.book.bookNumber}
              </div>
              <div>
                <span className="font-medium">Reported:</span> {record.reportedDate}
              </div>
              <div>
                <span className="font-medium">Book Price:</span> ₹{record.book.price}
              </div>
              <div>
                <span className="font-medium">Status:</span> {record.status}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="destructive">Missing</Badge>
              <Badge variant="outline">{record.book.type}</Badge>
              {record.status === 'resolved' && (
                <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>
              )}
            </div>

            {/* Missing Person Details */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">Missing Person Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {record.missingPersonType}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {record.missingPersonDetails.name}
                </div>
                {record.missingPersonType === 'Student' && (
                  <>
                    <div>
                      <span className="font-medium">Class:</span> {record.missingPersonDetails.class}
                    </div>
                    <div>
                      <span className="font-medium">Roll No:</span> {record.missingPersonDetails.rollNo}
                    </div>
                  </>
                )}
                {record.missingPersonType === 'Teacher' && (
                  <>
                    <div>
                      <span className="font-medium">Subject:</span> {record.missingPersonDetails.subject}
                    </div>
                    <div>
                      <span className="font-medium">Staff Room:</span> {record.missingPersonDetails.staffRoom}
                    </div>
                  </>
                )}
                {record.missingPersonType === 'Non-Teaching' && (
                  <div>
                    <span className="font-medium">Designation:</span> {record.missingPersonDetails.designation}
                  </div>
                )}
              </div>
            </div>

            {/* Repayment Information */}
            {record.repaymentMode && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Repayment Information</h4>
                <div className="text-sm">
                  <div>
                    <span className="font-medium">Mode:</span> {record.repaymentMode}
                  </div>
                  {record.repaymentMode === 'cash' && (
                    <div>
                      <span className="font-medium">Amount:</span> ₹{record.fineAmount}
                    </div>
                  )}
                  {record.repaymentMode === 'book' && (
                    <div>
                      <span className="font-medium">Replacement:</span> New book added with same ID
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {record.status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onProcessRepayment(record)}
              >
                Process Repayment
              </Button>
            )}
            {record.receiptGenerated && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onGenerateReceipt(record)}
              >
                <Printer className="w-4 h-4 mr-1" />
                Print Receipt
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

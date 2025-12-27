
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member } from "@/types/member";

interface DeleteMemberDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  member: Member | null;
  onDeleteMember: (memberId: string) => void;
}

export const DeleteMemberDialog = ({
  isOpen,
  setIsOpen,
  member,
  onDeleteMember
}: DeleteMemberDialogProps) => {
  const [enteredCardNumber, setEnteredCardNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = () => {
    if (!member) return;
    
    onDeleteMember(member.id);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
      setEnteredCardNumber("");
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEnteredCardNumber("");
  };

  const isCardNumberCorrect = enteredCardNumber === member?.cardNumber;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
        </DialogHeader>
        
        {showSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-green-800 font-medium">Member deleted successfully!</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Are you sure you want to delete this member? This action cannot be undone.
              </p>
              <div className="mt-3 text-sm">
                <p><strong>Name:</strong> {member?.name}</p>
                <p><strong>Card Number:</strong> {member?.cardNumber}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmCardNumber">Enter Card Number to confirm deletion</Label>
              <Input
                id="confirmCardNumber"
                value={enteredCardNumber}
                onChange={(e) => setEnteredCardNumber(e.target.value)}
                placeholder="Type the card number to confirm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={!isCardNumberCorrect}
              >
                Delete Member
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

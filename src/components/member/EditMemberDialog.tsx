
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member } from "@/types/member";
import { useSettings } from "@/contexts/SettingsContext";

interface EditMemberDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  member: Member | null;
  onUpdateMember: (member: Member) => void;
  isAcademicInstitution: boolean;
  isSchool: boolean;
  isCollege: boolean;
  existingMembers: Member[];
}

export const EditMemberDialog = ({
  isOpen,
  setIsOpen,
  member,
  onUpdateMember,
  isAcademicInstitution,
  isSchool,
  isCollege,
  existingMembers
}: EditMemberDialogProps) => {
  const {
    classes,
    divisions,
    streams,
    courses,
    yearSemesters,
    subjects,
    designations
  } = useSettings();

  const [editedMember, setEditedMember] = useState<Member | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (member) {
      setEditedMember({ ...member });
    }
  }, [member]);

  const validateMobileNumber = (mobile: string) => {
    if (!mobile.trim()) {
      return "Mobile number is required";
    }
    
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    
    return "";
  };

  const validateCardNumber = (cardNumber: string) => {
    if (!cardNumber.trim()) {
      return "Card number is required";
    }
    
    const existingCard = existingMembers.find(m => m.cardNumber === cardNumber.trim() && m.id !== member?.id);
    if (existingCard) {
      return "Card number already exists. Please use a unique card number.";
    }
    
    return "";
  };

  const handleSave = () => {
    if (!editedMember) return;

    const newErrors: Record<string, string> = {};

    if (!editedMember.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    const mobileError = validateMobileNumber(editedMember.mobileNumber);
    if (mobileError) {
      newErrors.mobileNumber = mobileError;
    }

    const cardError = validateCardNumber(editedMember.cardNumber);
    if (cardError) {
      newErrors.cardNumber = cardError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdateMember(editedMember);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
    }, 2000);
    setErrors({});
  };

  if (!editedMember) return null;

  const isHigherClass = editedMember.class === "XI" || editedMember.class === "XII";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="text-green-800 font-medium">Changes saved successfully!</div>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editedMember.name}
                onChange={(e) => {
                  setEditedMember({...editedMember, name: e.target.value});
                  setErrors({...errors, name: ""});
                }}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="edit-cardNumber">Card Number *</Label>
              <Input
                id="edit-cardNumber"
                value={editedMember.cardNumber}
                onChange={(e) => {
                  setEditedMember({...editedMember, cardNumber: e.target.value});
                  setErrors({...errors, cardNumber: ""});
                }}
                placeholder="Enter unique card number"
              />
              {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-mobileNumber">Mobile Number *</Label>
              <Input
                id="edit-mobileNumber"
                value={editedMember.mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setEditedMember({...editedMember, mobileNumber: value});
                  setErrors({...errors, mobileNumber: ""});
                }}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
              {errors.mobileNumber && <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <Label htmlFor="edit-gender">Gender</Label>
              <Select 
                value={editedMember.gender} 
                onValueChange={(value) => setEditedMember({...editedMember, gender: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isAcademicInstitution && editedMember.category === "Student" && isSchool && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-class">Class</Label>
                  <Select 
                    value={editedMember.class} 
                    onValueChange={(value) => setEditedMember({...editedMember, class: value, stream: ""})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-division">Division</Label>
                  <Select 
                    value={editedMember.division} 
                    onValueChange={(value) => setEditedMember({...editedMember, division: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((div) => (
                        <SelectItem key={div.id} value={div.name}>{div.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-rollNo">Roll No</Label>
                  <Input
                    id="edit-rollNo"
                    value={editedMember.rollNo || ""}
                    onChange={(e) => setEditedMember({...editedMember, rollNo: e.target.value})}
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              {isHigherClass && (
                <div>
                  <Label htmlFor="edit-stream">Stream</Label>
                  <Select 
                    value={editedMember.stream || ""} 
                    onValueChange={(value) => setEditedMember({...editedMember, stream: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streams.map((stream) => (
                        <SelectItem key={stream.id} value={stream.name}>{stream.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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

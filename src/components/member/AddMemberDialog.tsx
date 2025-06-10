
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Member } from "@/types/member";

interface AddMemberDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddMember: (member: Member) => void;
  generateMemberId: (category?: Member["category"]) => string;
  isAcademicInstitution: boolean;
  isSchool: boolean;
  isCollege: boolean;
}

export const AddMemberDialog = ({
  isOpen,
  setIsOpen,
  onAddMember,
  generateMemberId,
  isAcademicInstitution,
  isSchool,
  isCollege
}: AddMemberDialogProps) => {
  const [newMember, setNewMember] = useState({
    name: "",
    category: "Student" as Member["category"],
    class: "",
    division: "",
    rollNo: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
    teachingSubject: "",
    gender: "",
    staffRoomNo: "",
    designation: "",
    place: "",
    mobileNumber: "",
  });

  const handleAddMember = () => {
    const member: Member = {
      id: Date.now().toString(),
      memberId: generateMemberId(newMember.category),
      ...newMember,
      joinDate: new Date().toISOString().split('T')[0],
      booksIssued: 0,
      totalFines: 0,
      issuedBooks: [],
    };
    onAddMember(member);
    setIsOpen(false);
    setNewMember({
      name: "",
      category: "Student",
      class: "",
      division: "",
      rollNo: "",
      course: "",
      year: "",
      semester: "",
      subject: "",
      teachingSubject: "",
      gender: "",
      staffRoomNo: "",
      designation: "",
      place: "",
      mobileNumber: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={newMember.gender} 
                onValueChange={(value) => setNewMember({...newMember, gender: value})}
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

          {isAcademicInstitution && (
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={newMember.category} 
                onValueChange={(value: Member["category"]) => setNewMember({...newMember, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                  <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {isAcademicInstitution && newMember.category === "Student" && (
            <>
              {isSchool && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="class">Class</Label>
                    <Input
                      id="class"
                      value={newMember.class}
                      onChange={(e) => setNewMember({...newMember, class: e.target.value})}
                      placeholder="e.g., XII"
                    />
                  </div>
                  <div>
                    <Label htmlFor="division">Division</Label>
                    <Input
                      id="division"
                      value={newMember.division}
                      onChange={(e) => setNewMember({...newMember, division: e.target.value})}
                      placeholder="e.g., A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rollNo">Roll No</Label>
                    <Input
                      id="rollNo"
                      value={newMember.rollNo}
                      onChange={(e) => setNewMember({...newMember, rollNo: e.target.value})}
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>
              )}

              {isCollege && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      value={newMember.course}
                      onChange={(e) => setNewMember({...newMember, course: e.target.value})}
                      placeholder="e.g., B.Tech, MBA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year/Semester</Label>
                    <Input
                      id="year"
                      value={newMember.year}
                      onChange={(e) => setNewMember({...newMember, year: e.target.value})}
                      placeholder="e.g., 2nd Year, 4th Sem"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject/Branch</Label>
                    <Input
                      id="subject"
                      value={newMember.subject}
                      onChange={(e) => setNewMember({...newMember, subject: e.target.value})}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rollNo">Roll No</Label>
                    <Input
                      id="rollNo"
                      value={newMember.rollNo}
                      onChange={(e) => setNewMember({...newMember, rollNo: e.target.value})}
                      placeholder="e.g., 2021CS001"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {isAcademicInstitution && newMember.category === "Teaching Staff" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teachingSubject">Subject</Label>
                <Input
                  id="teachingSubject"
                  value={newMember.teachingSubject}
                  onChange={(e) => setNewMember({...newMember, teachingSubject: e.target.value})}
                  placeholder="e.g., Physics"
                />
              </div>
              <div>
                <Label htmlFor="staffRoomNo">Staff Room No</Label>
                <Input
                  id="staffRoomNo"
                  value={newMember.staffRoomNo}
                  onChange={(e) => setNewMember({...newMember, staffRoomNo: e.target.value})}
                  placeholder="e.g., 205"
                />
              </div>
            </div>
          )}

          {isAcademicInstitution && newMember.category === "Non-Teaching Staff" && (
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={newMember.designation}
                onChange={(e) => setNewMember({...newMember, designation: e.target.value})}
                placeholder="e.g., Librarian"
              />
            </div>
          )}

          {!isAcademicInstitution && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={newMember.place}
                  onChange={(e) => setNewMember({...newMember, place: e.target.value})}
                  placeholder="Enter place/location"
                />
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={newMember.mobileNumber}
                  onChange={(e) => setNewMember({...newMember, mobileNumber: e.target.value})}
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Member
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

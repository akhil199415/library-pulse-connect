
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

  // Mock data - In a real app, this would come from settings/context
  const schoolClasses = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const schoolDivisions = ["A", "B", "C", "D"];
  const collegeeCourses = ["B.Tech", "MBA", "BCA", "MCA", "B.Com", "M.Com"];
  const collegeYearSemesters = ["1st Year", "2nd Year", "3rd Year", "4th Year", "1st Semester", "2nd Semester", "3rd Semester", "4th Semester"];
  const collegeSubjects = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Finance", "Marketing"];

  const handleAddMember = () => {
    // Validation for required fields
    if (!newMember.name.trim()) {
      alert("Name is required");
      return;
    }
    
    if (!newMember.mobileNumber.trim()) {
      alert("Mobile number is required");
      return;
    }

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
                required
              />
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                value={newMember.mobileNumber}
                onChange={(e) => setNewMember({...newMember, mobileNumber: e.target.value})}
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            {!isAcademicInstitution && (
              <div>
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={newMember.place}
                  onChange={(e) => setNewMember({...newMember, place: e.target.value})}
                  placeholder="Enter place/location"
                />
              </div>
            )}
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
                    <Select 
                      value={newMember.class} 
                      onValueChange={(value) => setNewMember({...newMember, class: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {schoolClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="division">Division</Label>
                    <Select 
                      value={newMember.division} 
                      onValueChange={(value) => setNewMember({...newMember, division: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {schoolDivisions.map((div) => (
                          <SelectItem key={div} value={div}>{div}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select 
                      value={newMember.course} 
                      onValueChange={(value) => setNewMember({...newMember, course: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {collegeeCourses.map((course) => (
                          <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">Year/Semester</Label>
                    <Select 
                      value={newMember.year} 
                      onValueChange={(value) => setNewMember({...newMember, year: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year/semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {collegeYearSemesters.map((yearSem) => (
                          <SelectItem key={yearSem} value={yearSem}>{yearSem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject/Branch</Label>
                    <Select 
                      value={newMember.subject} 
                      onValueChange={(value) => setNewMember({...newMember, subject: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject/branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {collegeSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

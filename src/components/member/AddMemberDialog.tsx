
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Member } from "@/types/member";
import { useSettings } from "@/contexts/SettingsContext";

interface AddMemberDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddMember: (member: Member) => void;
  generateMemberId: (category?: Member["category"]) => string;
  isAcademicInstitution: boolean;
  isSchool: boolean;
  isCollege: boolean;
  existingMembers: Member[];
}

export const AddMemberDialog = ({
  isOpen,
  setIsOpen,
  onAddMember,
  generateMemberId,
  isAcademicInstitution,
  isSchool,
  isCollege,
  existingMembers
}: AddMemberDialogProps) => {
  const {
    classes,
    divisions,
    streams,
    courses,
    yearSemesters,
    subjects,
    designations
  } = useSettings();

  const [newMember, setNewMember] = useState({
    name: "",
    cardNumber: "",
    category: "Student" as Member["category"],
    class: "",
    division: "",
    stream: "",
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCardNumber = (cardNumber: string) => {
    if (!cardNumber.trim()) {
      return "Card number is required";
    }
    
    const existingCard = existingMembers.find(member => member.cardNumber === cardNumber.trim());
    if (existingCard) {
      return "Card number already exists. Please use a unique card number.";
    }
    
    return "";
  };

  const validateMobileNumber = (mobile: string) => {
    if (!mobile.trim()) {
      return "Mobile number is required";
    }
    
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    
    return "";
  };

  const handleAddMember = () => {
    const newErrors: Record<string, string> = {};

    // Validation for required fields
    if (!newMember.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    const mobileError = validateMobileNumber(newMember.mobileNumber);
    if (mobileError) {
      newErrors.mobileNumber = mobileError;
    }

    const cardError = validateCardNumber(newMember.cardNumber);
    if (cardError) {
      newErrors.cardNumber = cardError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const member: Member = {
      id: Date.now().toString(),
      memberId: generateMemberId(newMember.category),
      cardNumber: newMember.cardNumber.trim(),
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
      cardNumber: "",
      category: "Student",
      class: "",
      division: "",
      stream: "",
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
    setErrors({});
  };

  const isHigherClass = newMember.class === "XI" || newMember.class === "XII";

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
                onChange={(e) => {
                  setNewMember({...newMember, name: e.target.value});
                  setErrors({...errors, name: ""});
                }}
                placeholder="Enter full name"
                required
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={newMember.cardNumber}
                onChange={(e) => {
                  setNewMember({...newMember, cardNumber: e.target.value});
                  setErrors({...errors, cardNumber: ""});
                }}
                placeholder="Enter unique card number"
                required
              />
              {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                value={newMember.mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setNewMember({...newMember, mobileNumber: value});
                  setErrors({...errors, mobileNumber: ""});
                }}
                placeholder="Enter 10-digit mobile number"
                required
                maxLength={10}
              />
              {errors.mobileNumber && <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>}
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
                <Label htmlFor="designation">Designation</Label>
                <Select 
                  value={newMember.designation} 
                  onValueChange={(value) => setNewMember({...newMember, designation: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((designation) => (
                      <SelectItem key={designation.id} value={designation.name}>{designation.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

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
                      onValueChange={(value) => setNewMember({...newMember, class: value, stream: ""})}
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
                    <Label htmlFor="division">Division</Label>
                    <Select 
                      value={newMember.division} 
                      onValueChange={(value) => setNewMember({...newMember, division: value})}
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

              {isSchool && isHigherClass && (
                <div>
                  <Label htmlFor="stream">Stream</Label>
                  <Select 
                    value={newMember.stream} 
                    onValueChange={(value) => setNewMember({...newMember, stream: value})}
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
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
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
                        {yearSemesters.map((yearSem) => (
                          <SelectItem key={yearSem.id} value={yearSem.name}>{yearSem.name}</SelectItem>
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
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
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
              <Select 
                value={newMember.designation} 
                onValueChange={(value) => setNewMember({...newMember, designation: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((designation) => (
                    <SelectItem key={designation.id} value={designation.name}>{designation.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

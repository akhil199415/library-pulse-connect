import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Users, Calendar, Book } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/AuthProvider";

interface Member {
  id: string;
  memberId: string;
  name: string;
  category?: "Student" | "Teaching Staff" | "Non-Teaching Staff";
  photo?: string;
  // Student specific (School/College)
  class?: string;
  division?: string;
  rollNo?: string;
  course?: string; // For college
  year?: string; // For college
  semester?: string; // For college
  subject?: string; // For college student's subject
  // Teaching staff specific
  teachingSubject?: string;
  gender?: string;
  staffRoomNo?: string;
  // Non-teaching staff specific
  designation?: string;
  // General member fields (for non-academic institutions)
  place?: string;
  mobileNumber?: string;
  // Common
  joinDate: string;
  booksIssued: number;
  totalFines: number;
  issuedBooks: {
    title: string;
    issueDate: string;
    dueDate: string;
    isOverdue: boolean;
  }[];
}

export const MemberManagement = () => {
  const { user } = useAuth();
  const isAcademicInstitution = user?.institutionType === "School" || user?.institutionType === "College";
  const isSchool = user?.institutionType === "School";
  const isCollege = user?.institutionType === "College";

  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  const generateMemberId = (category?: Member["category"]) => {
    if (!isAcademicInstitution) {
      // For non-academic institutions, use simple numbering
      const lastMember = members[members.length - 1];
      const lastNumber = lastMember ? parseInt(lastMember.memberId.slice(3)) : 1000;
      return `MEM${String(lastNumber + 1).padStart(4, '0')}`;
    }
    
    const prefix = category === "Student" ? "STU" : category === "Teaching Staff" ? "TCH" : "NTC";
    const lastMember = members.filter(m => m.memberId.startsWith(prefix)).pop();
    const lastNumber = lastMember ? parseInt(lastMember.memberId.slice(3)) : 1233;
    return `${prefix}${String(lastNumber + 1).padStart(6, '0')}`;
  };

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
    setMembers([...members, member]);
    setIsAddDialogOpen(false);
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

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return diffDays > 7 ? (diffDays - 7) * 1 : 0; // ₹1 per day after 7 days
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !isAcademicInstitution || filterCategory === "all" || member.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member Management</h1>
          <p className="text-muted-foreground">{user?.institutionName} - {user?.institutionType}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {isAcademicInstitution && (
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Student">Students</SelectItem>
                  <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                  <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="outline">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={member.photo} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                        {member.category && <Badge variant="outline">{member.category}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {member.memberId}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {isSchool && member.category === "Student" && (
                        <>
                          <div>
                            <span className="font-medium">Class:</span> {member.class}-{member.division}
                          </div>
                          <div>
                            <span className="font-medium">Roll No:</span> {member.rollNo}
                          </div>
                        </>
                      )}
                      {isCollege && member.category === "Student" && (
                        <>
                          <div>
                            <span className="font-medium">Course:</span> {member.course}
                          </div>
                          <div>
                            <span className="font-medium">Year:</span> {member.year}
                          </div>
                          <div>
                            <span className="font-medium">Subject:</span> {member.subject}
                          </div>
                          <div>
                            <span className="font-medium">Roll No:</span> {member.rollNo}
                          </div>
                        </>
                      )}
                      {member.category === "Teaching Staff" && (
                        <>
                          <div>
                            <span className="font-medium">Subject:</span> {member.teachingSubject}
                          </div>
                          <div>
                            <span className="font-medium">Staff Room:</span> {member.staffRoomNo}
                          </div>
                        </>
                      )}
                      {member.category === "Non-Teaching Staff" && (
                        <div>
                          <span className="font-medium">Designation:</span> {member.designation}
                        </div>
                      )}
                      {!isAcademicInstitution && (
                        <>
                          <div>
                            <span className="font-medium">Place:</span> {member.place}
                          </div>
                          <div>
                            <span className="font-medium">Mobile:</span> {member.mobileNumber}
                          </div>
                        </>
                      )}
                      <div>
                        <span className="font-medium">Gender:</span> {member.gender}
                      </div>
                      <div>
                        <span className="font-medium">Joined:</span> {member.joinDate}
                      </div>
                      <div>
                        <span className="font-medium">Books Issued:</span> {member.booksIssued}
                      </div>
                    </div>

                    {member.booksIssued > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Book className="w-4 h-4" />
                          Currently Issued Books
                        </h4>
                        <div className="space-y-1">
                          {member.issuedBooks.map((book, index) => (
                            <div key={index} className="text-xs flex items-center justify-between">
                              <span>{book.title}</span>
                              <div className="flex items-center gap-2">
                                <span>Due: {book.dueDate}</span>
                                {book.isOverdue && (
                                  <Badge variant="destructive" className="text-xs">
                                    Overdue ₹{calculateFine(book.dueDate)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {member.totalFines > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600">
                          <span className="font-medium">Total Fines:</span> ₹{member.totalFines}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Member } from "@/types/member";
import { AddMemberDialog } from "@/components/member/AddMemberDialog";
import { EditMemberDialog } from "@/components/member/EditMemberDialog";
import { DeleteMemberDialog } from "@/components/member/DeleteMemberDialog";
import { MemberCard } from "@/components/member/MemberCard";
import { MemberFilters } from "@/components/member/MemberFilters";

export const MemberManagement = () => {
  const { user } = useAuth();
  const isAcademicInstitution = user?.institutionType === "School" || user?.institutionType === "College";
  const isSchool = user?.institutionType === "School";
  const isCollege = user?.institutionType === "College";

  const [members, setMembers] = useState<Member[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterDivision, setFilterDivision] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterYearSemester, setFilterYearSemester] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [cardNumber, setCardNumber] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const generateMemberId = (category?: Member["category"]) => {
    if (!isAcademicInstitution) {
      const lastMember = members[members.length - 1];
      const lastNumber = lastMember ? parseInt(lastMember.memberId.slice(3)) : 1000;
      return `MEM${String(lastNumber + 1).padStart(4, '0')}`;
    }
    
    const prefix = category === "Student" ? "STU" : category === "Teaching Staff" ? "TCH" : "NTC";
    const lastMember = members.filter(m => m.memberId.startsWith(prefix)).pop();
    const lastNumber = lastMember ? parseInt(lastMember.memberId.slice(3)) : 1233;
    return `${prefix}${String(lastNumber + 1).padStart(6, '0')}`;
  };

  const handleAddMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    setSuccessMessage("Member updated successfully!");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    setSuccessMessage("Member deleted successfully!");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  // Filter members based on search criteria
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCardNumber = cardNumber === "" || member.cardNumber.includes(cardNumber);
    const matchesCategory = filterCategory === "all" || member.category === filterCategory;
    const matchesClass = filterClass === "all" || member.class === filterClass;
    const matchesDivision = filterDivision === "all" || member.division === filterDivision;
    const matchesCourse = filterCourse === "all" || member.course === filterCourse;
    const matchesYearSemester = filterYearSemester === "all" || member.year === filterYearSemester || member.semester === filterYearSemester;
    const matchesSubject = filterSubject === "all" || member.subject === filterSubject;
    const matchesDesignation = filterDesignation === "all" || member.designation === filterDesignation;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const joinDate = new Date(member.joinDate);
      if (dateFrom) matchesDate = matchesDate && joinDate >= new Date(dateFrom);
      if (dateTo) matchesDate = matchesDate && joinDate <= new Date(dateTo);
    }

    return matchesSearch && matchesCardNumber && matchesCategory && matchesClass && 
           matchesDivision && matchesCourse && matchesYearSemester && matchesSubject && 
           matchesDesignation && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="text-green-800 font-medium">{successMessage}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member Management</h1>
          <p className="text-muted-foreground">{user?.institutionName} - {user?.institutionType}</p>
        </div>
        <AddMemberDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          onAddMember={handleAddMember}
          generateMemberId={generateMemberId}
          isAcademicInstitution={isAcademicInstitution}
          isSchool={isSchool}
          isCollege={isCollege}
          existingMembers={members}
        />
      </div>

      <MemberFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterClass={filterClass}
        setFilterClass={setFilterClass}
        filterDivision={filterDivision}
        setFilterDivision={setFilterDivision}
        filterCourse={filterCourse}
        setFilterCourse={setFilterCourse}
        filterYearSemester={filterYearSemester}
        setFilterYearSemester={setFilterYearSemester}
        filterSubject={filterSubject}
        setFilterSubject={setFilterSubject}
        filterDesignation={filterDesignation}
        setFilterDesignation={setFilterDesignation}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <MemberCard
                    member={member}
                    isSchool={isSchool}
                    isCollege={isCollege}
                    isAcademicInstitution={isAcademicInstitution}
                  />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditClick(member)}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(member)}
                    className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && members.length > 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {members.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Add members to get started.</p>
          </CardContent>
        </Card>
      )}

      <EditMemberDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        member={selectedMember}
        onUpdateMember={handleUpdateMember}
        isAcademicInstitution={isAcademicInstitution}
        isSchool={isSchool}
        isCollege={isCollege}
        existingMembers={members}
      />

      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        member={selectedMember}
        onDeleteMember={handleDeleteMember}
      />
    </div>
  );
};


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Member } from "@/types/member";
import { AddMemberDialog } from "@/components/member/AddMemberDialog";
import { MemberFilters } from "@/components/member/MemberFilters";
import { MemberCard } from "@/components/member/MemberCard";

export const MemberManagement = () => {
  const { user } = useAuth();
  const isAcademicInstitution = user?.institutionType === "School" || user?.institutionType === "College";
  const isSchool = user?.institutionType === "School";
  const isCollege = user?.institutionType === "College";

  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  const handleAddMember = (member: Member) => {
    setMembers([...members, member]);
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
        <AddMemberDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          onAddMember={handleAddMember}
          generateMemberId={generateMemberId}
          isAcademicInstitution={isAcademicInstitution}
          isSchool={isSchool}
          isCollege={isCollege}
        />
      </div>

      <MemberFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        isAcademicInstitution={isAcademicInstitution}
      />

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isSchool={isSchool}
            isCollege={isCollege}
            isAcademicInstitution={isAcademicInstitution}
          />
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

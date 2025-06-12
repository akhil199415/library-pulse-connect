
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
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

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
          existingMembers={members}
        />
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
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
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(member)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

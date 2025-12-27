
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Book } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/types/member";

interface MemberCardProps {
  member: Member;
  isSchool: boolean;
  isCollege: boolean;
  isAcademicInstitution: boolean;
}

export const MemberCard = ({ member, isSchool, isCollege, isAcademicInstitution }: MemberCardProps) => {
  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return diffDays > 7 ? (diffDays - 7) * 1 : 0; // ₹1 per day after 7 days
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
  );
};

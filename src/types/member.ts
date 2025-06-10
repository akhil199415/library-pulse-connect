
export interface Member {
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

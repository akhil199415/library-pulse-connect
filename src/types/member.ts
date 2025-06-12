
export interface Member {
  id: string;
  memberId: string;
  cardNumber: string;
  name: string;
  category: "Student" | "Teaching Staff" | "Non-Teaching Staff";
  class?: string;
  division?: string;
  stream?: string;
  rollNo?: string;
  course?: string;
  year?: string;
  semester?: string;
  subject?: string;
  teachingSubject?: string;
  gender: string;
  staffRoomNo?: string;
  designation?: string;
  place?: string;
  mobileNumber: string;
  joinDate: string;
  booksIssued: number;
  totalFines: number;
  issuedBooks: any[];
  photo?: string;
}

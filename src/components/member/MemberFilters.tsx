
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSettings } from "@/contexts/SettingsContext";

interface MemberFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterClass: string;
  setFilterClass: (classValue: string) => void;
  filterDivision: string;
  setFilterDivision: (division: string) => void;
  filterCourse: string;
  setFilterCourse: (course: string) => void;
  filterYearSemester: string;
  setFilterYearSemester: (yearSemester: string) => void;
  filterSubject: string;
  setFilterSubject: (subject: string) => void;
  filterDesignation: string;
  setFilterDesignation: (designation: string) => void;
  cardNumber: string;
  setCardNumber: (cardNumber: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
}

export const MemberFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory,
  filterClass,
  setFilterClass,
  filterDivision,
  setFilterDivision,
  filterCourse,
  setFilterCourse,
  filterYearSemester,
  setFilterYearSemester,
  filterSubject,
  setFilterSubject,
  filterDesignation,
  setFilterDesignation,
  cardNumber,
  setCardNumber,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo
}: MemberFiltersProps) => {
  const { user } = useAuth();
  const { classes, divisions, courses, yearSemesters, subjects, designations } = useSettings();
  
  const isSchool = user?.institutionType === "School";
  const isCollege = user?.institutionType === "College";
  const isAcademicInstitution = isSchool || isCollege;

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterClass("all");
    setFilterDivision("all");
    setFilterCourse("all");
    setFilterYearSemester("all");
    setFilterSubject("all");
    setFilterDesignation("all");
    setCardNumber("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter Members</CardTitle>
      </CardHeader>
      <CardContent>
        {isSchool && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.name}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDivision} onValueChange={setFilterDivision}>
              <SelectTrigger>
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={division.name}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From date"
                />
                <Label className="text-xs mt-1 block">From Date</Label>
              </div>
              <div>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To date"
                />
                <Label className="text-xs mt-1 block">To Date</Label>
              </div>
            </div>
          </div>
        )}

        {isCollege && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterYearSemester} onValueChange={setFilterYearSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Year/Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years/Semesters</SelectItem>
                {yearSemesters.map((yearSem) => (
                  <SelectItem key={yearSem.id} value={yearSem.name}>
                    {yearSem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject/Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects/Branches</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From date"
                />
                <Label className="text-xs mt-1 block">From Date</Label>
              </div>
              <div>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To date"
                />
                <Label className="text-xs mt-1 block">To Date</Label>
              </div>
            </div>
          </div>
        )}

        {!isAcademicInstitution && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Select value={filterDesignation} onValueChange={setFilterDesignation}>
              <SelectTrigger>
                <SelectValue placeholder="Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((designation) => (
                  <SelectItem key={designation.id} value={designation.name}>
                    {designation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From date"
                />
                <Label className="text-xs mt-1 block">From Date</Label>
              </div>
              <div>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To date"
                />
                <Label className="text-xs mt-1 block">To Date</Label>
              </div>
            </div>
          </div>
        )}

        <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
      </CardContent>
    </Card>
  );
};

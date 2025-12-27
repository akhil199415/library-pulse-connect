
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/contexts/SettingsContext";

interface MemberFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterClass: string;
  setFilterClass: (value: string) => void;
  filterDivision: string;
  setFilterDivision: (value: string) => void;
  filterCourse: string;
  setFilterCourse: (value: string) => void;
  filterYearSemester: string;
  setFilterYearSemester: (value: string) => void;
  filterSubject: string;
  setFilterSubject: (value: string) => void;
  filterDesignation: string;
  setFilterDesignation: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  isSchool: boolean;
  isCollege: boolean;
  isAcademicInstitution: boolean;
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
  setDateTo,
  isSchool,
  isCollege,
  isAcademicInstitution
}: MemberFiltersProps) => {
  const { classes, divisions, courses, yearSemesters, subjects, designations } = useSettings();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* School Layout */}
          {isSchool && (
            <>
              {/* First row - Name/Card Number, Category, Class, Division */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="searchTerm">Name / Card Number</Label>
                  <Input
                    id="searchTerm"
                    placeholder="Search by name or card number..."
                    value={searchTerm || cardNumber}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCardNumber(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="filterCategory">Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                      <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filterClass">Class</Label>
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filterDivision">Division</Label>
                  <Select value={filterDivision} onValueChange={setFilterDivision}>
                    <SelectTrigger>
                      <SelectValue placeholder="All divisions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Divisions</SelectItem>
                      {divisions.map((div) => (
                        <SelectItem key={div.id} value={div.name}>{div.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Second row - Date filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* College Layout */}
          {isCollege && (
            <>
              {/* First row - Name/Card Number, Category, Course, Year/Semester */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="searchTerm">Name / Card Number</Label>
                  <Input
                    id="searchTerm"
                    placeholder="Search by name or card number..."
                    value={searchTerm || cardNumber}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCardNumber(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="filterCategory">Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
                      <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filterCourse">Course</Label>
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="filterYearSemester">Year/Semester</Label>
                  <Select value={filterYearSemester} onValueChange={setFilterYearSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="All years/semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years/Semesters</SelectItem>
                      {yearSemesters.map((ys) => (
                        <SelectItem key={ys.id} value={ys.name}>{ys.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Second row - Subject/Branch, From Date, To Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="filterSubject">Subject/Branch</Label>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All subjects/branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects/Branches</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Non-academic institution layout */}
          {!isAcademicInstitution && (
            <>
              {/* First row - Name/Card Number and Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchTerm">Name / Card Number</Label>
                  <Input
                    id="searchTerm"
                    placeholder="Search by name or card number..."
                    value={searchTerm || cardNumber}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCardNumber(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="filterDesignation">Designation</Label>
                  <Select value={filterDesignation} onValueChange={setFilterDesignation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All designations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      {designations.map((designation) => (
                        <SelectItem key={designation.id} value={designation.name}>{designation.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Second row - Date filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

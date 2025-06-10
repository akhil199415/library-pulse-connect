
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface MemberFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  isAcademicInstitution: boolean;
}

export const MemberFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  isAcademicInstitution 
}: MemberFiltersProps) => {
  return (
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
  );
};

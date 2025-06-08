
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface BookFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterCondition: string;
  setFilterCondition: (condition: string) => void;
  onClearFilters: () => void;
}

export const BookFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterCondition,
  setFilterCondition,
  onClearFilters
}: BookFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="circulating">Circulating</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCondition} onValueChange={setFilterCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="obsolete">Obsolete</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
              <SelectItem value="binding">Binding</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onClearFilters}>Clear Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

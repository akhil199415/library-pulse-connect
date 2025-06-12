
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CirculationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterGenre: string;
  setFilterGenre: (genre: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
}

export const CirculationFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus,
  filterGenre,
  setFilterGenre,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo
}: CirculationFiltersProps) => {
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterGenre("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, book title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterGenre} onValueChange={setFilterGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="fiction">Fiction</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From date"
            />
            <Label htmlFor="dateFrom" className="text-xs mt-1 block">From Date</Label>
          </div>
          <div>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To date"
            />
            <Label htmlFor="dateTo" className="text-xs mt-1 block">To Date</Label>
          </div>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

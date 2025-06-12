
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Snowflake } from "lucide-react";
import { useState } from "react";

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
  const [isFreezeDialogOpen, setIsFreezeDialogOpen] = useState(false);
  const [freezeReason, setFreezeReason] = useState("");
  const [showFreezeSuccess, setShowFreezeSuccess] = useState(false);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterGenre("all");
    setDateFrom("");
    setDateTo("");
  };

  const handleFreezeOverdue = () => {
    if (freezeReason.trim()) {
      setIsFreezeDialogOpen(false);
      setShowFreezeSuccess(true);
      setFreezeReason("");
      setTimeout(() => setShowFreezeSuccess(false), 3000);
    }
  };

  return (
    <>
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
              <Label htmlFor="dateFrom" className="text-xs block mb-1">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From date"
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-xs block mb-1">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To date"
              />
            </div>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsFreezeDialogOpen(true)}
            >
              <Snowflake className="w-4 h-4" />
              Freeze Overdue Fine
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Freeze Overdue Dialog */}
      <Dialog open={isFreezeDialogOpen} onOpenChange={setIsFreezeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze Overdue Fine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="freezeReason">Reason for Freezing Overdue Fine</Label>
              <Textarea
                id="freezeReason"
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                placeholder="Enter reason for freezing overdue fine..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFreezeDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleFreezeOverdue}
                disabled={!freezeReason.trim()}
              >
                Freeze Fine
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Message */}
      {showFreezeSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <Snowflake className="w-5 h-5" />
              <span className="font-medium">Overdue fine has been frozen successfully from today's date.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

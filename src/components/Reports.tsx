
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Users, BookOpen, Calendar } from "lucide-react";

export const Reports = () => {
  const circulationData = [
    { month: "Jan", circulations: 156, returns: 142 },
    { month: "Feb", circulations: 178, returns: 165 },
    { month: "Mar", circulations: 165, returns: 158 },
    { month: "Apr", circulations: 189, returns: 174 },
    { month: "May", circulations: 201, returns: 186 },
    { month: "Jun", circulations: 167, returns: 189 },
  ];

  const popularBooks = [
    { title: "Introduction to Computer Science", circulations: 45 },
    { title: "Modern Physics", circulations: 38 },
    { title: "Advanced Mathematics", circulations: 32 },
    { title: "Data Structures", circulations: 28 },
    { title: "Chemistry Fundamentals", circulations: 25 },
  ];

  const memberActivityData = [
    { category: "Students", active: 85, inactive: 15 },
    { category: "Teaching Staff", active: 92, inactive: 8 },
    { category: "Non-Teaching Staff", active: 78, inactive: 22 },
  ];

  const overdueData = [
    { department: "Science", books: 12 },
    { department: "Mathematics", books: 8 },
    { department: "Computer Science", books: 15 },
    { department: "Literature", books: 5 },
    { department: "History", books: 3 },
  ];

  const genreData = [
    { name: "Technology", value: 35, color: "#3b82f6" },
    { name: "Science", value: 25, color: "#10b981" },
    { name: "Mathematics", value: 20, color: "#f59e0b" },
    { name: "Literature", value: 12, color: "#ef4444" },
    { name: "History", value: 8, color: "#8b5cf6" },
  ];

  const reportCards = [
    {
      title: "Total Circulations",
      value: "1,234",
      change: "+12%",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Members",
      value: "856",
      change: "+5%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Books Added",
      value: "89",
      change: "+23%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Return Rate",
      value: "96.5%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {card.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {card.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circulation Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Circulation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={circulationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="circulations" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Circulations"
                />
                <Line 
                  type="monotone" 
                  dataKey="returns" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Returns"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Collection by Genre */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Distribution by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Circulated Books</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularBooks} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="title" width={120} fontSize={12} />
                <Tooltip />
                <Bar dataKey="circulations" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overdue Books by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Books by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overdueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="books" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Member Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Active Members</th>
                  <th className="text-left py-3 px-4 font-medium">Inactive Members</th>
                  <th className="text-left py-3 px-4 font-medium">Activity Rate</th>
                </tr>
              </thead>
              <tbody>
                {memberActivityData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{data.category}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{data.active}%</td>
                    <td className="py-3 px-4 text-red-600 font-medium">{data.inactive}%</td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${data.active}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

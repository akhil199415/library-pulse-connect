
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const Dashboard = () => {
  const stats = [
    {
      title: "Total Books",
      value: "2,847",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Books in Circulation",
      value: "423",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Members",
      value: "1,256",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Overdue Books",
      value: "23",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const chartData = [
    { month: "Jan", books: 45 },
    { month: "Feb", books: 52 },
    { month: "Mar", books: 48 },
    { month: "Apr", books: 61 },
    { month: "May", books: 55 },
    { month: "Jun", books: 67 },
  ];

  const genreData = [
    { name: "Fiction", value: 35, color: "#3b82f6" },
    { name: "Science", value: 25, color: "#10b981" },
    { name: "History", value: 20, color: "#f59e0b" },
    { name: "Technology", value: 20, color: "#ef4444" },
  ];

  const recentBooks = [
    { title: "The Future of AI", author: "Dr. Sarah Johnson", date: "2024-06-01" },
    { title: "Modern Web Development", author: "Alex Chen", date: "2024-05-28" },
    { title: "Data Science Fundamentals", author: "Maria Rodriguez", date: "2024-05-25" },
    { title: "Climate Change Solutions", author: "Prof. David Kim", date: "2024-05-22" },
  ];

  const activeUsers = [
    { name: "Emily Parker", books: 12, type: "Student" },
    { name: "Dr. Michael Brown", books: 8, type: "Faculty" },
    { name: "Jessica Wilson", books: 7, type: "Student" },
    { name: "Prof. Lisa Davis", books: 6, type: "Faculty" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Circulation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Book Circulation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="books" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Books by Genre</CardTitle>
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
        {/* Recently Added Books */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{book.title}</p>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{book.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{user.books}</p>
                    <p className="text-xs text-muted-foreground">books</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

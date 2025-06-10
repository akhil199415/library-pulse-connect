
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
  onSendOTP: (email: string) => void;
  onBack: () => void;
}

export const ForgotPassword = ({ onSendOTP, onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      onSendOTP(email);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">LibraryMS</h1>
          </div>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your registered email address and we'll send you an OTP to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

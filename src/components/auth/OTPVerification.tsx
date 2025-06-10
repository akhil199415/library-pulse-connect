
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerifySuccess: () => void;
  onBack: () => void;
  title: string;
  description: string;
}

export const OTPVerification = ({ 
  email, 
  onVerifySuccess, 
  onBack, 
  title, 
  description 
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setIsVerifying(true);
    
    // Simulate OTP verification (in real app, this would call your backend)
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP
      if (otp === "123456" || otp.length === 6) {
        onVerifySuccess();
      } else {
        alert("Invalid OTP. Please try again.");
        setOtp("");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResendOTP = () => {
    // Simulate resending OTP
    console.log("Resending OTP to:", email);
    setTimeLeft(40);
    setCanResend(false);
    setOtp("");
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
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
            <br />
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {timeLeft > 0 ? (
              <span>Resend OTP in {timeLeft} seconds</span>
            ) : (
              <Button 
                variant="link" 
                onClick={handleResendOTP}
                disabled={!canResend}
                className="p-0 h-auto"
              >
                Resend OTP
              </Button>
            )}
          </div>

          <Button 
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

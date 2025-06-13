import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus, LogIn, Key, AlertCircle } from "lucide-react";
import { InstitutionType } from "@/components/auth/AuthProvider";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { PasswordSetup } from "@/components/auth/PasswordSetup";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onSignup: (credentials: { 
    email: string; 
    password: string; 
    name: string;
    institutionType: InstitutionType;
    institutionName: string;
  }) => void;
}

type AuthStep = 'auth' | 'signup-otp' | 'signup-password' | 'forgot-password' | 'forgot-otp' | 'reset-password' | 'success';

// Mock valid keys - in a real app, this would be validated on the backend
const VALID_KEYS = ['LMS2024-SCHOOL-001', 'LMS2024-COLLEGE-002', 'LMS2024-PUBLIC-003'];
const USED_KEYS = new Set<string>(); // Track used keys

export const AuthForm = ({ onLogin, onSignup }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('auth');
  const [keyError, setKeyError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institutionType: "School" as InstitutionType,
    institutionName: "",
    appWebsiteKey: "",
  });

  const institutionTypes: InstitutionType[] = [
    "School",
    "College", 
    "Public Institution",
    "Hotel",
    "Hospital",
    "NGO"
  ];

  const validateAppKey = (key: string): boolean => {
    // Check if key is valid and not used
    if (!VALID_KEYS.includes(key)) {
      setKeyError("Invalid App Website Key. Please contact your administrator.");
      return false;
    }
    if (USED_KEYS.has(key)) {
      setKeyError("This App Website Key has already been used.");
      return false;
    }
    setKeyError("");
    return true;
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email: formData.email, password: formData.password });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate App Website Key
    if (!validateAppKey(formData.appWebsiteKey)) {
      return;
    }
    
    // Mark key as used
    USED_KEYS.add(formData.appWebsiteKey);
    
    // Move to OTP verification step
    setCurrentStep('signup-otp');
  };

  const handleSignUpOTPVerified = () => {
    setCurrentStep('signup-password');
  };

  const handlePasswordSet = (password: string) => {
    const signupData = {
      ...formData,
      password
    };
    onSignup(signupData);
    setCurrentStep('success');
    
    // Redirect to main app after success message
    setTimeout(() => {
      setCurrentStep('auth');
    }, 2000);
  };

  const handleForgotPassword = () => {
    setCurrentStep('forgot-password');
  };

  const handleForgotOTPSent = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setCurrentStep('forgot-otp');
  };

  const handleForgotOTPVerified = () => {
    setCurrentStep('reset-password');
  };

  const handlePasswordReset = (newPassword: string) => {
    // In a real app, you would update the password in your backend
    console.log('Password reset for:', formData.email);
    setCurrentStep('success');
    
    // Redirect to sign in after success
    setTimeout(() => {
      setCurrentStep('auth');
      setIsSignUp(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear key error when user starts typing in the key field
    if (e.target.name === 'appWebsiteKey') {
      setKeyError("");
    }
  };

  const goBackToAuth = () => {
    setCurrentStep('auth');
  };

  // OTP verification steps
  if (currentStep === 'signup-otp') {
    return (
      <OTPVerification
        email={formData.email}
        onVerifySuccess={handleSignUpOTPVerified}
        onBack={goBackToAuth}
        title="Verify Your Email"
        description="We've sent a 6-digit verification code to:"
      />
    );
  }

  if (currentStep === 'signup-password') {
    return (
      <PasswordSetup
        email={formData.email}
        onPasswordSet={handlePasswordSet}
        onBack={() => setCurrentStep('signup-otp')}
        isReset={false}
      />
    );
  }

  if (currentStep === 'forgot-password') {
    return (
      <ForgotPassword
        onSendOTP={handleForgotOTPSent}
        onBack={goBackToAuth}
      />
    );
  }

  if (currentStep === 'forgot-otp') {
    return (
      <OTPVerification
        email={formData.email}
        onVerifySuccess={handleForgotOTPVerified}
        onBack={() => setCurrentStep('forgot-password')}
        title="Reset Password"
        description="We've sent a 6-digit verification code to:"
      />
    );
  }

  if (currentStep === 'reset-password') {
    return (
      <PasswordSetup
        email={formData.email}
        onPasswordSet={handlePasswordReset}
        onBack={() => setCurrentStep('forgot-otp')}
        isReset={true}
      />
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Success!</h2>
            <p className="text-muted-foreground">
              {isSignUp ? 'Account created successfully!' : 'Password updated successfully!'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main auth form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">LibraryMS</h1>
          </div>
          <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Enter your details to create your account" 
              : "Enter your credentials to access the system"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="appWebsiteKey">App Website Key *</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="appWebsiteKey"
                      name="appWebsiteKey"
                      type="text"
                      placeholder="Enter your app website key"
                      value={formData.appWebsiteKey}
                      onChange={handleInputChange}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                  {keyError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{keyError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={isSignUp}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionType">Institution Type *</Label>
                  <Select 
                    value={formData.institutionType} 
                    onValueChange={(value: InstitutionType) => 
                      setFormData(prev => ({...prev, institutionType: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    type="text"
                    placeholder="Enter institution name"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    required={isSignUp}
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {!isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Continue with Email Verification
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          {!isSignUp && (
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={handleForgotPassword}
                className="text-sm"
              >
                Forgot Password?
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

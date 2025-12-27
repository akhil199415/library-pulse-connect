
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, Building, Eye, EyeOff } from "lucide-react";
import { useAuth, InstitutionType } from "@/components/auth/AuthProvider";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { PasswordSetup } from "@/components/auth/PasswordSetup";

const AuthForm = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Forgot Password Flow
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [passwordSetup, setPasswordSetup] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    institutionType: "School" as InstitutionType,
    institutionName: "",
    activationKey: "",
  });

  const institutionTypes: InstitutionType[] = ["School", "College", "Public Institution", "Hotel", "Hospital", "NGO"];

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
    // Clear errors when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value });
    // Clear errors when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signupData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!signupData.institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }
    
    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!signupData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate login process
    setTimeout(() => {
      try {
        login(loginData);
        setIsLoading(false);
      } catch (error) {
        setErrors({ general: "Invalid email or password. Please try again." });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSignup();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        email: signupData.email,
        institutionName: signupData.institutionName,
        institutionType: signupData.institutionType,
      };
      
      login({ email: signupData.email, password: signupData.password });
      setIsLoading(false);
    }, 1000);
  };

  // Forgot Password Flow Handlers
  const handleSendOTP = (email: string) => {
    setEmailForReset(email);
    setOtpSent(true);
  };

  const handleVerifySuccess = () => {
    setPasswordSetup(true);
  };

  const handlePasswordSet = (password: string) => {
    signup({
      email: signupData.email,
      password: password,
      name: signupData.name,
      institutionType: signupData.institutionType,
      institutionName: signupData.institutionName,
    });
  };

  if (forgotPassword) {
    return (
      <ForgotPassword
        onSendOTP={handleSendOTP}
        onBack={() => setForgotPassword(false)}
      />
    );
  }

  if (otpSent) {
    return (
      <OTPVerification
        email={emailForReset}
        onVerifySuccess={handleVerifySuccess}
        onBack={() => setOtpSent(false)}
        title="OTP Verification"
        description="Enter the OTP sent to your email address"
      />
    );
  }

  if (passwordSetup) {
    return (
      <PasswordSetup
        email={emailForReset}
        onPasswordSet={handlePasswordSet}
        onBack={() => setPasswordSetup(false)}
        isReset={true}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              {isLogin ? (
                <Lock className="w-5 h-5 text-primary-foreground" />
              ) : (
                <User className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <h1 className="text-xl font-bold">LibraryMS</h1>
          </div>
          <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your credentials to access your account" : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  type="text"
                  placeholder="Enter your institution name"
                  value={signupData.institutionName}
                  onChange={handleSignupChange}
                  className={errors.institutionName ? "border-red-500" : ""}
                />
                {errors.institutionName && <p className="text-sm text-red-500">{errors.institutionName}</p>}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="institutionType">Institution Type</Label>
                <Select value={signupData.institutionType} onValueChange={(value) => setSignupData({ ...signupData, institutionType: value as InstitutionType })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="activationKey">Activation Key (Optional)</Label>
                <Input
                  id="activationKey"
                  type="text"
                  placeholder="Enter activation key if provided"
                  value={signupData.activationKey}
                  onChange={handleSignupChange}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={isLogin ? loginData.email : signupData.email}
                onChange={isLogin ? handleLoginChange : handleSignupChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isLogin ? (showPassword ? "text" : "password") : (showSignupPassword ? "text" : "password")}
                  placeholder="Enter your password"
                  value={isLogin ? loginData.password : signupData.password}
                  onChange={isLogin ? handleLoginChange : handleSignupChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => {
                    if (isLogin) {
                      setShowPassword(!showPassword);
                    } else {
                      setShowSignupPassword(!showSignupPassword);
                    }
                  }}
                >
                  {isLogin ? (showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />) : (showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />)}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>
          
          {isLogin && (
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setForgotPassword(true)}
                className="p-0 h-auto"
              >
                Forgot Password?
              </Button>
            </div>
          )}
          
          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="w-full"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

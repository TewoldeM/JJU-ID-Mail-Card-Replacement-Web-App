"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IdCard,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "../layouts/layout";

/**
 * Auth component
 * - Keeps your full UI/UX exactly as provided
 * - Adds sign-in and sign-up logic (calls /api/auth/signin and /api/auth/signup)
 * - Adds client validation similar to your previous SignUpForm
 * - Accepts optional prop `defaultMode` to open in "signup" or "signin" mode
 */

type Props = {
  defaultMode?: "signin" | "signup";
};

export default function Auth({ defaultMode = "signin" }: Props) {
  const router = useRouter();
  const { login } = useAuth();

  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UX state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helpers: split full name -> FirstName / LastName
  const splitName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts.shift() || "";
    const last = parts.join(" ") || "";
    return { first, last };
  };

  // Validation
  function validateSignup() {
    // sanitize numeric fields
    const cleanedStudentId = studentId.replace(/\D+/g, "");
    const cleanedYear = year.replace(/\D+/g, "");
    const cleanedPhone = phone.replace(/\D+/g, "");

    if (!fullName || !email || !password || !cleanedStudentId || !cleanedYear) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (cleanedStudentId.length !== 4) {
      setError("Student ID must be exactly 4 digits.");
      return false;
    }

    if (cleanedYear.length !== 2) {
      setError("Year must be exactly 2 digits.");
      return false;
    }

    if (cleanedPhone && cleanedPhone.length !== 10) {
      setError("Phone number must be 10 digits if provided.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    // basic email check
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please provide a valid email address.");
      return false;
    }

    setError(null);
    return true;
  }

  function validateSignin() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return false;
    }
    setError(null);
    return true;
  }

  // submit handler for both sign in and sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      if (!validateSignup()) return;
    } else {
      if (!validateSignin()) return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up payload - match your previous signup shape
        const { first, last } = splitName(fullName);

        const cleanedStudentId = studentId.replace(/\D+/g, "");
        const cleanedYear = year.replace(/\D+/g, "");
        const cleanedPhone = phone.replace(/\D+/g, "") || undefined;

        const body = {
          FirstName: first,
          LastName: last,
          StudentId: cleanedStudentId,
          Year: cleanedYear,
          PhoneNumber: cleanedPhone,
          Password: password,
          Email: email,
        };

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
          // Expecting token + refreshToken + user like your previous code
          if (!data.token || !data.refreshToken) {
            setError("Registration failed: missing tokens.");
            setLoading(false);
            return;
          }
          // store using context login
          try {
            login(data.token, data.refreshToken, data.user);
          } catch (ctxErr) {
            // If your context login expects a different shape, adjust accordingly
            console.warn("login context error:", ctxErr);
          }
          // redirect to student dashboard after signup
          router.push("/StudentDashboard");
        } else {
          setError(data.error || data.message || "Registration failed");
        }
      } else {
        // Sign in
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email, Password: password }),
        });

        const data = await res.json();

        if (res.ok) {
          if (!data.token || !data.refreshToken) {
            setError("Authentication failed: missing tokens.");
            setLoading(false);
            return;
          }

          try {
            login(data.token, data.refreshToken, data.user);
          } catch (ctxErr) {
            console.warn("login context error:", ctxErr);
          }

          const userRoles = data.user?.Roles || [];
          if (Array.isArray(userRoles) && userRoles.includes("ADMIN")) {
            router.push("/Admin/AdminDashboard");
          } else {
            router.push("/StudentDashboard");
          }
        } else {
          setError(data.error || data.message || "Invalid email or password");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left Side - Branding */}
          <div
            className={`hidden lg:flex flex-col justify-center p-8 transition-all duration-700 ${isSignUp ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100"}`}
          >
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full">
                <IdCard className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Student Portal
                </span>
              </div>

              <h1 className="text-4xl xl:text-5xl font-heading font-bold text-foreground leading-tight">
                {isSignUp ? (
                  <>
                    Join{" "}
                    <span className="text-primary">Jigjiga University</span>{" "}
                    Digital Services
                  </>
                ) : (
                  <>
                    Welcome Back to{" "}
                    <span className="text-primary">Jigjiga University</span>
                  </>
                )}
              </h1>

              <p className="text-lg text-muted-foreground">
                {isSignUp
                  ? "Create your account to apply for ID and Meal Card replacement services online."
                  : "Sign in to manage your card replacement applications and track your status."}
              </p>

              {/* Feature List */}
              <div className="space-y-4 pt-4">
                {[
                  {
                    icon: IdCard,
                    text: "Apply for ID & Meal Card replacement",
                  },
                  {
                    icon: GraduationCap,
                    text: "Track your application status",
                  },
                  { icon: Lock, text: "Secure and confidential process" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              {/* Card Container */}
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* Tab Switcher */}
                <div className="relative flex bg-muted/50 p-1 m-4 rounded-xl">
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-lg transition-all duration-500 ease-out ${isSignUp ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}`}
                  />
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300 ${!isSignUp ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg relative z-10 transition-colors duration-300 ${isSignUp ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-6 pt-2">
                  {/* Mobile Header */}
                  <div className="lg:hidden text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full mb-3">
                      <IdCard className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        Student Portal
                      </span>
                    </div>
                    <h2 className="text-xl font-heading font-bold text-foreground">
                      {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Sign Up Fields */}
                    <div
                      className={`space-y-4 transition-all duration-500 overflow-hidden ${isSignUp ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium text-foreground"
                        >
                          Full Name
                        </Label>
                        <div
                          className={`relative transition-all duration-300 ${focusedField === "fullName" ? "scale-[1.02]" : ""}`}
                        >
                          <User
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "fullName" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                            onFocus={() => setFocusedField("fullName")}
                            onBlur={() => setFocusedField(null)}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Student ID */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="studentId"
                          className="text-sm font-medium text-foreground"
                        >
                          Student ID
                        </Label>
                        <div
                          className={`relative transition-all duration-300 ${focusedField === "studentId" ? "scale-[1.02]" : ""}`}
                        >
                          <IdCard
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "studentId" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <Input
                            id="studentId"
                            type="text"
                            placeholder="Enter your student ID"
                            className="pl-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                            onFocus={() => setFocusedField("studentId")}
                            onBlur={() => setFocusedField(null)}
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Year (added to match previous signup) */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="year"
                          className="text-sm font-medium text-foreground"
                        >
                          Year
                        </Label>
                        <div
                          className={`relative transition-all duration-300 ${focusedField === "year" ? "scale-[1.02]" : ""}`}
                        >
                          <GraduationCap
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "year" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <Input
                            id="year"
                            type="text"
                            placeholder="Enter your year (e.g. 13)"
                            className="pl-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                            onFocus={() => setFocusedField("year")}
                            onBlur={() => setFocusedField(null)}
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      {/* <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-foreground"
                        >
                          Phone Number
                        </Label>
                        <div
                          className={`relative transition-all duration-300 ${focusedField === "phone" ? "scale-[1.02]" : ""}`}
                        >
                          <Phone
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "phone" ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField(null)}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div> */}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email Address
                      </Label>
                      <div
                        className={`relative transition-all duration-300 ${focusedField === "email" ? "scale-[1.02]" : ""}`}
                      >
                        <Mail
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "email" ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-foreground"
                      >
                        Password
                      </Label>
                      <div
                        className={`relative transition-all duration-300 ${focusedField === "password" ? "scale-[1.02]" : ""}`}
                      >
                        <Lock
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "password" ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-11 pr-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password - Sign Up Only */}
                    <div
                      className={`space-y-2 transition-all duration-500 overflow-hidden ${isSignUp ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-foreground"
                      >
                        Confirm Password
                      </Label>
                      <div
                        className={`relative transition-all duration-300 ${focusedField === "confirmPassword" ? "scale-[1.02]" : ""}`}
                      >
                        <Lock
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === "confirmPassword" ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-11 pr-11 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={() => setFocusedField(null)}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password - Sign In Only */}
                    {!isSignUp && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Error alert */}
                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="outline"
                      size="lg"
                      className="w-full h-12 mt-2 group"
                      disabled={loading}
                    >
                      <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 h-11 px-4 border border-border rounded-lg bg-background hover:bg-muted transition-all duration-300 hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-foreground">
                          Google
                        </span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 h-11 px-4 border border-border rounded-lg bg-background hover:bg-muted transition-all duration-300 hover:scale-[1.02]"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span className="text-sm font-medium text-foreground">
                          GitHub
                        </span>
                      </button>
                    </div>

                    {/* Terms */}
                    {isSignUp && (
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        By creating an account, you agree to our{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signUp, signIn } from "@/integrations/gcp/auth";

const ROLE_DASHBOARD: Record<string, string> = {
  candidate: "/candidate/dashboard",
  agency: "/agency/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

const Login = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  useEffect(() => {
    if (loading || !user) return;
    if (role) {
      const dashboard = ROLE_DASHBOARD[role] ?? "/candidate/dashboard";
      navigate(from ?? dashboard, { replace: true });
    }
  }, [user, role, loading, navigate, from]);

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      await signUp(authEmail, authPassword);
      toast({ title: "Account created", description: "Redirecting..." });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      setAuthError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered. Please log in instead."
          : err.message ?? "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      await signIn(authEmail, authPassword);
      toast({ title: "Welcome back", description: "Redirecting..." });
    } catch (error: unknown) {
      const err = error as { message?: string };
      setAuthError(err.message ?? "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 border-b">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Log in or sign up</h1>
            <p className="text-muted-foreground mt-1">
              Access your Bridging Talent account
            </p>
          </div>
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Log In</TabsTrigger>
            </TabsList>
            <TabsContent value="signup" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password (min 6 characters)</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button
                onClick={handleSignUp}
                className="w-full"
                disabled={isSubmitting || !authEmail || authPassword.length < 6}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </TabsContent>
            <TabsContent value="login" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button
                onClick={handleLogin}
                className="w-full"
                disabled={isSubmitting || !authEmail || !authPassword}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Login;

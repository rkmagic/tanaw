import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AgencyDashboard = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4 flex justify-between items-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>Logout</Button>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Agency Dashboard</h1>
        <p className="text-muted-foreground">Placeholder for agency features. Coming soon.</p>
      </main>
    </div>
  );
};

export default AgencyDashboard;

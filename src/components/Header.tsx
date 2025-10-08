import { Link, useLocation, useNavigate } from "react-router-dom";
import { Scale, MessageSquare, FileText, MapPin, Newspaper, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "@/components/MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold text-primary">ENACT</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            asChild
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            aria-current={isActive("/") ? "page" : undefined}
          >
            <Link to="/">Home</Link>
          </Button>
              <Button
                asChild
                variant={isActive("/chat") ? "default" : "ghost"}
                size="sm"
                aria-current={isActive("/chat") ? "page" : undefined}
              >
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                  Chat Assistant
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/documents") ? "default" : "ghost"}
                size="sm"
                aria-current={isActive("/documents") ? "page" : undefined}
              >
                <Link to="/documents">
                  <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                  Documents
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/resources") ? "default" : "ghost"}
                size="sm"
                aria-current={isActive("/resources") ? "page" : undefined}
              >
                <Link to="/resources">
                  <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />
                  Resources
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive("/news") ? "default" : "ghost"}
                size="sm"
                aria-current={isActive("/news") ? "page" : undefined}
              >
                <Link to="/news">
                  <Newspaper className="h-4 w-4 mr-2" aria-hidden="true" />
                  Legal News
                </Link>
              </Button>
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

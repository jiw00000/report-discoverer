import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Menu, BookMarked, LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import UnifiedSearchBar from "./UnifiedSearchBar";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname === "/";

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-3">
        <div className="flex h-16 items-center justify-between mb-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">리포트랙</span>
          </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            onClick={() => navigate("/ai-search")}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 검색
          </Button>
          {user ? (
            <>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={() => navigate("/my-bookmarks")}
              >
                <BookMarked className="w-4 h-4 mr-2" />
                내 과제함
              </Button>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                내 정보
              </Button>
              <Button 
                variant="outline"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="hidden md:inline-flex"
                onClick={() => navigate("/auth")}
              >
                로그인
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-accent text-white"
                onClick={() => navigate("/auth")}
              >
                시작하기
              </Button>
            </>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">리포트랙</span>
                </div>

                <div className="border-t border-border my-4" />

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/ai-search")}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI 검색
                </Button>

                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/my-bookmarks")}
                    >
                      <BookMarked className="w-4 h-4 mr-2" />
                      내 과제함
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/profile")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      내 정보
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/auth")}
                    >
                      로그인
                    </Button>
                    
                    <Button
                      className="bg-gradient-to-r from-primary to-accent text-white justify-start"
                      onClick={() => handleNavigation("/auth")}
                    >
                      시작하기
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        </div>
        
        {!isHomePage && (
          <div className="w-full">
            <UnifiedSearchBar />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

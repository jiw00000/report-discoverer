import { Button } from "@/components/ui/button";
import { FileText, Menu, BookMarked, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">리포트랙</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#categories" className="text-foreground hover:text-primary transition-colors">
            카테고리
          </a>
          <a href="#resources" className="text-foreground hover:text-primary transition-colors">
            자료 유형
          </a>
          <a href="#features" className="text-foreground hover:text-primary transition-colors">
            서비스 소개
          </a>
        </nav>

        <div className="flex items-center gap-3">
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
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

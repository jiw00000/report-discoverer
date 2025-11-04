import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">리포트랙</span>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              A+ 리포트를 위한 검증된 자료 저장소
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">경영/경제</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">IT/테크</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">사회/문화</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">인문/예술</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">자료 유형</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">논문/학술지</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">통계/데이터</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">보고서</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">참고 사이트</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">고객지원</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">이용가이드</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">문의하기</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">공지사항</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60">
            <p>&copy; 2024 Report-Rack. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">이용약관</a>
              <a href="#" className="hover:text-accent transition-colors">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

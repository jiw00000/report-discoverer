import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  "검증된 10,000+ 자료 무료 이용",
  "주제별 큐레이션으로 빠른 탐색",
  "내 과제함으로 자료 정리",
  "신뢰도 높은 출처만 엄선"
];

const CTA = () => {
  const navigate = useNavigate();

  const handleScrollToCategories = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          
          <p className="text-xl text-white/90 mb-8">
            더 이상 자료 찾느라 시간 낭비하지 마세요
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-2xl group"
              onClick={() => navigate('/auth')}
            >
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full"
              onClick={handleScrollToCategories}
            >
              자료 둘러보기
            </Button>
          </div>

          <p className="text-sm text-white/70 mt-6">
            회원가입 없이도 자료를 둘러볼 수 있습니다
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;

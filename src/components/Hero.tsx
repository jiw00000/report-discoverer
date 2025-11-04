import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students researching in modern library"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/90" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          A+ 리포트를 위한<br />
          <span className="text-accent-foreground">검증된 자료 저장소</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
          아직도 구글링만 하니? 교수님이 찾는 바로 그 자료, 리포트랙
        </p>
        
        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
          과제 자료 찾는데 3시간? 30분으로 줄여줄게.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-2xl">
            <div className="flex-1 flex items-center pl-4">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <Input 
                type="text"
                placeholder="주제나 키워드로 검색해보세요 (예: MZ세대 소비 트렌드)"
                className="border-0 focus-visible:ring-0 bg-transparent text-base"
              />
            </div>
            <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all">
              검색
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-white/90">
          <div>
            <div className="text-3xl font-bold">10,000+</div>
            <div className="text-sm">검증된 자료</div>
          </div>
          <div>
            <div className="text-3xl font-bold">20+</div>
            <div className="text-sm">주제 카테고리</div>
          </div>
          <div>
            <div className="text-3xl font-bold">5,000+</div>
            <div className="text-sm">만족한 학생들</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

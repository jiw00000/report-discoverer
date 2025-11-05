import { Card } from "@/components/ui/card";
import { BookOpen, Cpu, Users, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: BookOpen,
    title: "경영/경제",
    description: "마케팅 사례, ESG 경영, 소비자 행동, 무역 동향",
    color: "from-blue-500 to-cyan-500",
    count: "2,500+"
  },
  {
    icon: Cpu,
    title: "IT/테크",
    description: "AI 윤리, 메타버스, 데이터 사이언스, 최신 기술 트렌드",
    color: "from-cyan-500 to-teal-500",
    count: "3,200+"
  },
  {
    icon: Users,
    title: "사회/문화",
    description: "인구 변화, 환경 문제, 미디어 리터러시, 젠더 이슈",
    color: "from-teal-500 to-emerald-500",
    count: "2,800+"
  },
  {
    icon: Palette,
    title: "인문/예술",
    description: "현대 철학, 디자인 트렌드, 문화 콘텐츠 분석",
    color: "from-emerald-500 to-green-500",
    count: "1,500+"
  }
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            주제별 자료 큐레이션
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            가장 많이 찾는 주제별로 미리 분류된 검증된 자료들을 탐색하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer border-border group"
                onClick={() => navigate(`/category/${encodeURIComponent(category.title)}`)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-card-foreground mb-2">
                  {category.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-semibold">{category.count} 자료</span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    탐색하기 →
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

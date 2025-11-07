import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Atom, BookOpen, Users, TrendingUp, Palette, Heart, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const subCategories: Record<string, string[]> = {
  "공과대학": ["컴퓨터공학", "인공지능", "소프트웨어", "전자전기", "반도체", "로봇공학", "기계", "항공", "재료", "산업공학", "토목", "건축", "환경", "에너지"],
  "자연과학대학": ["수학", "통계", "물리", "화학", "생명과학", "지구과학", "천문학", "데이터과학", "계산과학"],
  "인문대학": ["철학", "역사", "문학", "언어학", "종교학", "문화연구", "고전학", "미학", "사상사"],
  "사회과학대학": ["사회학", "심리학", "인류학", "정치외교", "행정", "법학", "미디어", "커뮤니케이션", "저널리즘"],
  "경영경제대학": ["경영학", "마케팅", "회계", "재무", "경제학", "국제무역", "금융", "창업", "혁신", "조직관리"],
  "예술체육대학": ["디자인", "순수미술", "건축디자인", "음악", "연극", "영상", "영화", "체육", "무용", "패션"],
  "의생명대학": ["의학", "간호", "약학", "생명공학", "유전학", "뇌과학", "바이오헬스", "헬스케어", "재활"],
  "교육대학": ["교육학", "교육공학", "교사교육", "평가", "상담", "평생교육", "학습심리"]
};

const categories = [
  {
    icon: Cpu,
    title: "공과대학",
    description: "컴퓨터공학, 인공지능, 전자전기, 반도체, 기계, 항공, 토목, 건축",
    color: "from-blue-500 to-cyan-500",
    count: "4,200+"
  },
  {
    icon: Atom,
    title: "자연과학대학",
    description: "수학, 통계, 물리, 화학, 생명과학, 지구과학, 데이터과학",
    color: "from-cyan-500 to-teal-500",
    count: "3,500+"
  },
  {
    icon: BookOpen,
    title: "인문대학",
    description: "철학, 역사, 문학, 언어학, 종교학, 문화연구, 미학",
    color: "from-purple-500 to-pink-500",
    count: "2,800+"
  },
  {
    icon: Users,
    title: "사회과학대학",
    description: "사회학, 심리학, 정치외교, 행정, 법학, 미디어, 커뮤니케이션",
    color: "from-orange-500 to-red-500",
    count: "3,200+"
  },
  {
    icon: TrendingUp,
    title: "경영경제대학",
    description: "경영학, 마케팅, 회계, 재무, 경제학, 국제무역, 창업",
    color: "from-green-500 to-emerald-500",
    count: "3,600+"
  },
  {
    icon: Palette,
    title: "예술체육대학",
    description: "디자인, 순수미술, 음악, 연극, 영상, 체육, 무용",
    color: "from-pink-500 to-rose-500",
    count: "2,100+"
  },
  {
    icon: Heart,
    title: "의생명대학",
    description: "의학, 간호, 약학, 생명공학, 유전학, 뇌과학, 바이오헬스",
    color: "from-red-500 to-orange-500",
    count: "2,900+"
  },
  {
    icon: GraduationCap,
    title: "교육대학",
    description: "교육학, 교육공학, 교사교육, 평가, 상담, 평생교육",
    color: "from-indigo-500 to-purple-500",
    count: "1,800+"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                
                <div className="flex flex-wrap gap-1.5 mb-4 min-h-[80px]">
                  {subCategories[category.title]?.slice(0, 8).map((subCat, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/search?q=${encodeURIComponent(subCat)}`);
                      }}
                    >
                      {subCat}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-semibold">{category.count} 자료</span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    전체 보기 →
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

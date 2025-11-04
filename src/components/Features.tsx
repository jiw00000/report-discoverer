import { Card } from "@/components/ui/card";
import { Clock, Shield, Target, Bookmark } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "시간 절약",
    description: "여러 사이트를 헤매는 대신, 한곳에서 필요한 모든 자료를 탐색하세요. 자료 조사 시간을 80% 단축합니다.",
    stat: "3시간 → 30분"
  },
  {
    icon: Shield,
    title: "신뢰도 보장",
    description: "운영자가 직접 검증한 공신력 있는 자료만 제공합니다. 개인 블로그나 출처 불명 자료는 철저히 배제합니다.",
    stat: "100% 검증"
  },
  {
    icon: Target,
    title: "맞춤형 큐레이션",
    description: "주제별로 미리 분류된 자료로 막막함 없이 바로 시작할 수 있습니다. 전공과 과제 주제에 딱 맞는 자료를 찾으세요.",
    stat: "20+ 카테고리"
  },
  {
    icon: Bookmark,
    title: "내 과제함",
    description: "유용한 자료를 스크랩하고 메모를 남겨 나만의 자료 저장소를 만들 수 있습니다. 과제별로 정리하세요.",
    stat: "무제한 저장"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            왜 리포트랙인가요?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A+ 학점을 향한 가장 빠른 길
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-8 bg-card border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                      {feature.stat}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

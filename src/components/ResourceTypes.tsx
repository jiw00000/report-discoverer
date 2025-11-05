import { Card } from "@/components/ui/card";
import { FileText, BarChart3, FileSpreadsheet, Globe } from "lucide-react";

const sourceLinks: Record<string, string> = {
  "RISS": "https://www.riss.kr/",
  "DBpia": "https://www.dbpia.co.kr/",
  "KISS": "https://kiss.kstudy.com/",
  "Google Scholar": "https://scholar.google.com/",
  "KOSIS": "https://kosis.kr/",
  "공공데이터포털": "https://www.data.go.kr/",
  "통계청": "https://kostat.go.kr/",
  "e-나라지표": "https://www.index.go.kr/",
  "KDI": "https://www.kdi.re.kr/",
  "산업연구원": "https://www.kiet.re.kr/",
  "정책연구원": "https://www.kipa.re.kr/",
  "STEPI": "https://www.stepi.re.kr/",
  "공공기관": "https://www.alio.go.kr/",
  "연구소": "https://www.nrf.re.kr/",
  "학회": "https://www.kci.go.kr/",
  "정부부처": "https://www.gov.kr/"
};

const resourceTypes = [
  {
    icon: FileText,
    title: "논문/학술지",
    description: "RISS, DBpia 등 주요 학술지 링크",
    sources: ["RISS", "DBpia", "KISS", "Google Scholar"]
  },
  {
    icon: BarChart3,
    title: "통계/데이터",
    description: "KOSIS, 공공데이터포털 등 국가 공식 통계",
    sources: ["KOSIS", "공공데이터포털", "통계청", "e-나라지표"]
  },
  {
    icon: FileSpreadsheet,
    title: "보고서/리포트",
    description: "정부 및 공공기관 연구 보고서",
    sources: ["KDI", "산업연구원", "정책연구원", "STEPI"]
  },
  {
    icon: Globe,
    title: "필수 참고 사이트",
    description: "해당 주제 연구 시 필수 방문 사이트 모음",
    sources: ["공공기관", "연구소", "학회", "정부부처"]
  }
];

const ResourceTypes = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            자료 유형별 필터
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            신뢰도 높은 자료 유형만 모아서 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 border-border group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-lg font-bold text-card-foreground mb-2">
                  {type.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {type.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {type.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={sourceLinks[source]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                      {source}
                    </a>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceTypes;

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark, ExternalLink, FileText, BarChart3, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 검색 키워드와 관련 자료 매핑
const searchData: Record<string, any> = {
  "mz세대": {
    relatedKeywords: ["Z세대", "밀레니얼", "소비트렌드", "디지털네이티브", "MZ세대 마케팅"],
    relatedCategories: ["경영경제대학", "사회과학대학"],
    resources: [
      {
        title: "MZ세대의 소비 패턴과 마케팅 전략",
        description: "MZ세대의 가치관과 소비 행동을 분석하고 효과적인 마케팅 전략을 제시",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=be54d9b8bc7cdb09&control_no=example1",
        type: "논문",
        source: "RISS",
        category: "경영경제대학"
      },
      {
        title: "Z세대 디지털 소비 행태 조사 보고서",
        description: "통계청 주관 Z세대의 온라인 소비 패턴 및 트렌드 분석",
        url: "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1example",
        type: "통계/데이터",
        source: "KOSIS",
        category: "사회과학대학"
      },
      {
        title: "밀레니얼 세대의 사회문화적 특성 연구",
        description: "밀레니얼 세대의 가치관, 라이프스타일, 사회 참여 양상 분석",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example",
        type: "논문",
        source: "DBpia",
        category: "사회과학대학"
      }
    ]
  },
  "ai": {
    relatedKeywords: ["인공지능", "머신러닝", "딥러닝", "ChatGPT", "AI 윤리"],
    relatedCategories: ["공과대학", "자연과학대학"],
    resources: [
      {
        title: "생성형 AI의 현황과 미래 전망",
        description: "ChatGPT, Midjourney 등 생성형 AI 기술의 발전과 산업 영향 분석",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example1",
        type: "보고서",
        source: "KDI",
        category: "공과대학"
      },
      {
        title: "인공지능 윤리 가이드라인 연구",
        description: "AI 기술 발전에 따른 윤리적 이슈와 규제 방향 제시",
        url: "https://www.stepi.re.kr/site/stepiko/report/View.do?reIdx=example2",
        type: "보고서",
        source: "STEPI",
        category: "공과대학"
      },
      {
        title: "AI 기술 동향 및 산업 적용 사례",
        description: "주요 산업별 AI 기술 도입 현황과 효과 분석",
        url: "https://www.kiet.re.kr/research/view?no=example3",
        type: "보고서",
        source: "산업연구원",
        category: "공과대학"
      }
    ]
  },
  "esg": {
    relatedKeywords: ["ESG경영", "지속가능경영", "환경경영", "사회적책임", "ESG투자"],
    relatedCategories: ["경영경제대학", "사회과학대학"],
    resources: [
      {
        title: "국내 기업의 ESG 경영 실태와 개선 방안",
        description: "주요 기업의 ESG 경영 현황 분석 및 발전 방향 제시",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example4",
        type: "보고서",
        source: "KDI",
        category: "경영경제대학"
      },
      {
        title: "ESG 투자 동향 및 전망",
        description: "글로벌 ESG 투자 시장 현황과 국내 시장 전망",
        url: "https://kiss.kstudy.com/Detail/Ar?key=example5",
        type: "논문",
        source: "KISS",
        category: "경영경제대학"
      }
    ]
  },
  "메타버스": {
    relatedKeywords: ["가상현실", "VR", "AR", "메타버스 플랫폼", "디지털 전환"],
    relatedCategories: ["공과대학", "예술체육대학"],
    resources: [
      {
        title: "메타버스 산업 동향 및 발전 방향",
        description: "국내외 메타버스 산업 현황과 향후 전망 분석",
        url: "https://www.stepi.re.kr/site/stepiko/report/View.do?reIdx=example6",
        type: "보고서",
        source: "STEPI",
        category: "공과대학"
      },
      {
        title: "메타버스 플랫폼의 사회문화적 영향",
        description: "메타버스가 가져올 사회적 변화와 문화적 의미 분석",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=be54d9b8bc7cdb09&control_no=example7",
        type: "논문",
        source: "RISS",
        category: "예술체육대학"
      }
    ]
  },
  "반도체": {
    relatedKeywords: ["칩", "전자공학", "나노기술", "반도체 산업", "웨이퍼"],
    relatedCategories: ["공과대학"],
    resources: [
      {
        title: "차세대 반도체 기술 동향",
        description: "3nm 이하 공정 기술과 차세대 반도체 소재 연구",
        url: "https://www.kiet.re.kr/research/view?no=example8",
        type: "보고서",
        source: "산업연구원",
        category: "공과대학"
      },
      {
        title: "글로벌 반도체 공급망 분석",
        description: "반도체 산업의 국제 경쟁 구도와 공급망 전략",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example9",
        type: "논문",
        source: "RISS",
        category: "공과대학"
      }
    ]
  },
  "바이오": {
    relatedKeywords: ["생명공학", "유전자", "의료", "바이오테크", "제약"],
    relatedCategories: ["의생명대학", "자연과학대학"],
    resources: [
      {
        title: "바이오헬스 산업 현황과 전망",
        description: "국내 바이오산업의 성장과 글로벌 경쟁력 분석",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example10",
        type: "보고서",
        source: "KDI",
        category: "의생명대학"
      },
      {
        title: "유전자 편집 기술의 발전",
        description: "CRISPR 기술과 정밀의학의 미래",
        url: "https://www.stepi.re.kr/site/stepiko/report/View.do?reIdx=example11",
        type: "연구자료",
        source: "STEPI",
        category: "의생명대학"
      }
    ]
  },
  "디자인": {
    relatedKeywords: ["UX", "UI", "그래픽", "제품디자인", "브랜딩"],
    relatedCategories: ["예술체육대학"],
    resources: [
      {
        title: "사용자 경험 디자인 방법론",
        description: "UX/UI 디자인의 원칙과 실무 적용 사례",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example12",
        type: "논문",
        source: "RISS",
        category: "예술체육대학"
      },
      {
        title: "브랜드 아이덴티티 디자인",
        description: "성공적인 브랜드 디자인 전략과 사례 연구",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example13",
        type: "학술자료",
        source: "DBpia",
        category: "예술체육대학"
      }
    ]
  },
  "교육": {
    relatedKeywords: ["에듀테크", "온라인교육", "평생학습", "교수법", "교육정책"],
    relatedCategories: ["교육대학"],
    resources: [
      {
        title: "디지털 전환 시대의 교육",
        description: "에듀테크 활용과 미래 교육 방향",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example14",
        type: "보고서",
        source: "KDI",
        category: "교육대학"
      },
      {
        title: "평생학습 사회의 교육 시스템",
        description: "성인 학습자를 위한 교육 프로그램 개발",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example15",
        type: "논문",
        source: "RISS",
        category: "교육대학"
      }
    ]
  }
};

// 기본 자료 (검색어가 매핑되지 않은 경우)
const defaultResources = [
  {
    title: "대학생 학술 연구 방법론",
    description: "효과적인 학술 자료 검색 및 활용 방법",
    url: "https://www.riss.kr/",
    type: "논문",
    source: "RISS",
    category: "기타"
  },
  {
    title: "공공데이터 활용 가이드",
    description: "정부 공공데이터 포털 활용 방법 및 사례",
    url: "https://www.data.go.kr/",
    type: "통계/데이터",
    source: "공공데이터포털",
    category: "기타"
  }
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [displayQuery, setDisplayQuery] = useState(searchParams.get("q") || "");

  const normalizedQuery = displayQuery.toLowerCase().replace(/\s+/g, "");
  const searchResult = searchData[normalizedQuery] || {
    relatedKeywords: ["학술자료", "논문", "통계", "보고서"],
    relatedCategories: ["공과대학", "자연과학대학", "인문대학", "사회과학대학"],
    resources: defaultResources
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setDisplayQuery(q);
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRelatedKeywordClick = (keyword: string) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const handleBookmark = async (resource: any) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          title: resource.title,
          description: resource.description,
          url: resource.url,
          bookmark_type: resource.type,
          category: resource.category,
        });

      if (error) throw error;
      toast.success("북마크에 추가되었습니다");
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast.error("북마크 추가에 실패했습니다");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "논문":
        return <FileText className="w-4 h-4" />;
      case "통계/데이터":
        return <BarChart3 className="w-4 h-4" />;
      case "보고서":
        return <FileText className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8">
        {/* 검색바 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-2 bg-background rounded-lg border border-border p-2 shadow-sm">
            <div className="flex-1 flex items-center pl-2">
              <Search className="w-5 h-5 text-muted-foreground mr-2" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="주제나 키워드로 검색해보세요"
                className="border-0 focus-visible:ring-0 bg-transparent"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              검색
            </Button>
          </div>
        </div>

        {/* 검색 결과 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            "{displayQuery}" 검색 결과
          </h1>
          <p className="text-muted-foreground">
            총 {searchResult.resources.length}개의 자료를 찾았습니다
          </p>
        </div>

        {/* 연관 검색어 */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            연관 검색어
          </h2>
          <div className="flex flex-wrap gap-2">
            {searchResult.relatedKeywords.map((keyword: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm py-1 px-3"
                onClick={() => handleRelatedKeywordClick(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 관련 주제 */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            관련 주제 카테고리
          </h2>
          <div className="flex flex-wrap gap-2">
            {searchResult.relatedCategories.map((category: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors text-sm py-1 px-3"
                onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 검색 결과 자료 목록 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            검색 결과
          </h2>
          {searchResult.resources.map((resource: any, index: number) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </Badge>
                    <Badge variant="outline">{resource.source}</Badge>
                    <Badge variant="outline">{resource.category}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookmark(resource)}
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      북마크
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                    >
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        자료 보기
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 추가 검색 제안 */}
        {searchResult.resources.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              검색 결과가 없습니다. 다른 키워드로 검색해보세요.
            </p>
            <Button variant="outline" onClick={() => navigate("/")}>
              홈으로 돌아가기
            </Button>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;

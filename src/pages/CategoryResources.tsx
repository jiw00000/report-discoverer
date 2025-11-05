import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categoryData = {
  "경영/경제": {
    title: "경영/경제",
    description: "마케팅 사례, ESG 경영, 소비자 행동, 무역 동향",
    resources: [
      {
        title: "2024 글로벌 ESG 경영 동향",
        description: "세계 주요 기업들의 ESG 경영 사례와 전략 분석",
        url: "https://example.com/esg-2024",
        type: "보고서",
        source: "한국경제연구원"
      },
      {
        title: "디지털 마케팅 성공 사례 모음",
        description: "국내외 성공적인 디지털 마케팅 캠페인 사례 연구",
        url: "https://example.com/digital-marketing",
        type: "사례연구",
        source: "마케팅협회"
      },
      {
        title: "Z세대 소비 트렌드 분석",
        description: "Z세대의 소비 패턴과 선호도에 대한 심층 분석",
        url: "https://example.com/gen-z-trends",
        type: "연구자료",
        source: "소비자연구원"
      }
    ]
  },
  "IT/테크": {
    title: "IT/테크",
    description: "AI 윤리, 메타버스, 데이터 사이언스, 최신 기술 트렌드",
    resources: [
      {
        title: "AI 윤리 가이드라인",
        description: "인공지능 개발 및 활용에 있어 윤리적 고려사항",
        url: "https://example.com/ai-ethics",
        type: "가이드",
        source: "AI 연구소"
      },
      {
        title: "메타버스 플랫폼 비교 분석",
        description: "주요 메타버스 플랫폼의 특징과 활용 방안",
        url: "https://example.com/metaverse",
        type: "분석보고서",
        source: "테크리뷰"
      },
      {
        title: "데이터 사이언스 입문",
        description: "데이터 분석의 기초부터 머신러닝까지",
        url: "https://example.com/data-science",
        type: "교육자료",
        source: "데이터과학회"
      }
    ]
  },
  "사회/문화": {
    title: "사회/문화",
    description: "인구 변화, 환경 문제, 미디어 리터러시, 젠더 이슈",
    resources: [
      {
        title: "인구 구조 변화와 사회적 영향",
        description: "저출산·고령화가 가져올 사회 변화 전망",
        url: "https://example.com/population",
        type: "정책보고서",
        source: "통계청"
      },
      {
        title: "기후변화와 환경정책",
        description: "글로벌 기후위기 대응 정책 사례",
        url: "https://example.com/climate",
        type: "정책자료",
        source: "환경부"
      },
      {
        title: "미디어 리터러시 교육 가이드",
        description: "가짜뉴스 판별과 비판적 미디어 활용법",
        url: "https://example.com/media-literacy",
        type: "교육자료",
        source: "언론진흥재단"
      }
    ]
  },
  "인문/예술": {
    title: "인문/예술",
    description: "현대 철학, 디자인 트렌드, 문화 콘텐츠 분석",
    resources: [
      {
        title: "현대 철학의 주요 담론",
        description: "21세기 철학의 핵심 주제와 사상가들",
        url: "https://example.com/philosophy",
        type: "학술자료",
        source: "철학연구소"
      },
      {
        title: "2024 디자인 트렌드",
        description: "올해의 주요 디자인 트렌드와 적용 사례",
        url: "https://example.com/design-trends",
        type: "트렌드리포트",
        source: "디자인협회"
      },
      {
        title: "한류 콘텐츠 글로벌 영향력 분석",
        description: "K-문화의 세계적 확산과 산업적 가치",
        url: "https://example.com/k-culture",
        type: "분석보고서",
        source: "콘텐츠진흥원"
      }
    ]
  }
};

const CategoryResources = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const categoryInfo = category ? categoryData[category as keyof typeof categoryData] : null;

  const handleBookmark = async (resource: any) => {
    if (!user) {
      toast.error("북마크하려면 로그인이 필요합니다");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        title: resource.title,
        url: resource.url,
        description: resource.description,
        category: categoryInfo?.title || "",
        bookmark_type: "resource"
      });

      if (error) throw error;
      toast.success("북마크에 추가되었습니다");
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast.error("북마크 추가 중 오류가 발생했습니다");
    }
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">카테고리를 찾을 수 없습니다</h2>
          <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로 가기
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {categoryInfo.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {categoryInfo.description}
          </p>
        </div>

        <div className="grid gap-6">
          {categoryInfo.resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{resource.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {resource.source}
                      </span>
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {resource.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleBookmark(resource)}
                      title="북마크에 추가"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={() => window.open(resource.url, "_blank")}
                >
                  자료 보기
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryResources;
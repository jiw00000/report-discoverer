import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const categoryData = {
  "공과대학": {
    title: "공과대학",
    description: "컴퓨터공학, 인공지능, 전자전기, 반도체, 기계, 항공, 토목, 건축",
    resources: [
      {
        title: "인공지능과 머신러닝 최신 동향",
        description: "AI 기술의 발전과 산업 적용 사례 분석",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example1",
        type: "논문",
        source: "RISS",
        subCategory: "인공지능"
      },
      {
        title: "반도체 산업 글로벌 트렌드",
        description: "차세대 반도체 기술과 시장 전망",
        url: "https://www.kiet.re.kr/research/view?no=example2",
        type: "보고서",
        source: "산업연구원",
        subCategory: "반도체"
      },
      {
        title: "건축 및 도시계획 지속가능성 연구",
        description: "친환경 건축과 스마트시티 사례",
        url: "https://www.stepi.re.kr/site/stepiko/report/View.do?reIdx=example3",
        type: "연구자료",
        source: "STEPI",
        subCategory: "건축"
      }
    ]
  },
  "자연과학대학": {
    title: "자연과학대학",
    description: "수학, 통계, 물리, 화학, 생명과학, 지구과학, 데이터과학",
    resources: [
      {
        title: "데이터 사이언스 입문과 응용",
        description: "통계와 머신러닝을 활용한 데이터 분석 기법",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example4",
        type: "논문",
        source: "RISS"
      },
      {
        title: "기후변화와 지구과학",
        description: "지구 온난화의 과학적 메커니즘 연구",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example5",
        type: "보고서",
        source: "KDI"
      },
      {
        title: "생명과학의 최신 연구 동향",
        description: "유전자 편집과 생명공학 기술 발전",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example6",
        type: "학술자료",
        source: "DBpia"
      }
    ]
  },
  "인문대학": {
    title: "인문대학",
    description: "철학, 역사, 문학, 언어학, 종교학, 문화연구, 미학",
    resources: [
      {
        title: "현대 철학의 주요 담론",
        description: "21세기 철학의 핵심 주제와 사상가들",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example7",
        type: "논문",
        source: "RISS"
      },
      {
        title: "한국 근현대사 연구",
        description: "한국사의 주요 사건과 역사적 의미",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example8",
        type: "학술자료",
        source: "DBpia"
      },
      {
        title: "세계 문학의 이해",
        description: "주요 작품과 문학사조 분석",
        url: "https://kiss.kstudy.com/Detail/Ar?key=example9",
        type: "연구자료",
        source: "KISS"
      }
    ]
  },
  "사회과학대학": {
    title: "사회과학대학",
    description: "사회학, 심리학, 정치외교, 행정, 법학, 미디어, 커뮤니케이션",
    resources: [
      {
        title: "현대 사회의 불평등 연구",
        description: "소득 불평등과 사회 계층화 분석",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example10",
        type: "보고서",
        source: "KDI"
      },
      {
        title: "디지털 미디어와 커뮤니케이션",
        description: "소셜미디어 시대의 정보 소통 방식",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example11",
        type: "논문",
        source: "RISS"
      },
      {
        title: "심리학의 이해와 응용",
        description: "인지심리학과 사회심리학 연구",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example12",
        type: "학술자료",
        source: "DBpia"
      }
    ]
  },
  "경영경제대학": {
    title: "경영경제대학",
    description: "경영학, 마케팅, 회계, 재무, 경제학, 국제무역, 창업",
    resources: [
      {
        title: "디지털 마케팅 전략과 사례",
        description: "온라인 마케팅의 최신 트렌드와 성공 사례",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example13",
        type: "보고서",
        source: "KDI"
      },
      {
        title: "스타트업 창업 가이드",
        description: "성공적인 창업을 위한 전략과 실무",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example14",
        type: "논문",
        source: "RISS"
      },
      {
        title: "ESG 경영과 지속가능성",
        description: "기업의 사회적 책임과 ESG 경영 사례",
        url: "https://kiss.kstudy.com/Detail/Ar?key=example15",
        type: "연구자료",
        source: "KISS"
      }
    ]
  },
  "예술체육대학": {
    title: "예술체육대학",
    description: "디자인, 순수미술, 음악, 연극, 영상, 체육, 무용",
    resources: [
      {
        title: "현대 디자인 트렌드",
        description: "UX/UI 디자인과 비주얼 커뮤니케이션",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example16",
        type: "논문",
        source: "RISS"
      },
      {
        title: "영화와 영상 콘텐츠 분석",
        description: "영상 매체의 서사 구조와 표현 기법",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example17",
        type: "학술자료",
        source: "DBpia"
      },
      {
        title: "스포츠과학과 운동생리학",
        description: "운동과 건강에 대한 과학적 접근",
        url: "https://kiss.kstudy.com/Detail/Ar?key=example18",
        type: "연구자료",
        source: "KISS"
      }
    ]
  },
  "의생명대학": {
    title: "의생명대학",
    description: "의학, 간호, 약학, 생명공학, 유전학, 뇌과학, 바이오헬스",
    resources: [
      {
        title: "의료 AI와 디지털 헬스케어",
        description: "인공지능을 활용한 의료 진단과 치료",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example19",
        type: "보고서",
        source: "KDI"
      },
      {
        title: "유전자 치료와 정밀의학",
        description: "개인 맞춤형 의료의 현재와 미래",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example20",
        type: "논문",
        source: "RISS"
      },
      {
        title: "뇌과학과 신경과학 연구",
        description: "뇌 기능과 신경계 질환 연구 동향",
        url: "https://www.stepi.re.kr/site/stepiko/report/View.do?reIdx=example21",
        type: "연구자료",
        source: "STEPI"
      }
    ]
  },
  "교육대학": {
    title: "교육대학",
    description: "교육학, 교육공학, 교사교육, 평가, 상담, 평생교육",
    resources: [
      {
        title: "에듀테크와 디지털 교육",
        description: "교육 기술의 발전과 온라인 학습",
        url: "https://www.riss.kr/search/detail/DetailView.do?p_mat_type=example22",
        type: "논문",
        source: "RISS"
      },
      {
        title: "평생교육과 성인학습",
        description: "평생학습 사회의 교육 체계",
        url: "https://www.kdi.re.kr/research/reportView?pub_no=example23",
        type: "보고서",
        source: "KDI"
      },
      {
        title: "학습심리와 교육평가",
        description: "효과적인 학습 방법과 평가 시스템",
        url: "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11example24",
        type: "학술자료",
        source: "DBpia"
      }
    ]
  }
};

const CategoryResources = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const categoryInfo = category ? categoryData[category as keyof typeof categoryData] : null;
  
  const filteredResources = selectedSubCategory
    ? categoryInfo?.resources.filter((r: any) => r.subCategory === selectedSubCategory)
    : categoryInfo?.resources;

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
          <p className="text-lg text-muted-foreground mb-4">
            {categoryInfo.description}
          </p>
          
          {/* 세부 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant={selectedSubCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSubCategory(null)}
            >
              전체
            </Badge>
            {subCategories[categoryInfo.title]?.map((subCat) => (
              <Badge
                key={subCat}
                variant={selectedSubCategory === subCat ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedSubCategory(subCat)}
              >
                {subCat}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredResources && filteredResources.length > 0 ? (
            filteredResources.map((resource: any, index: number) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{resource.type}</Badge>
                      <Badge variant="outline">{resource.source}</Badge>
                      {resource.subCategory && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {resource.subCategory}
                        </Badge>
                      )}
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
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                선택한 세부 카테고리에 해당하는 자료가 없습니다.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryResources;
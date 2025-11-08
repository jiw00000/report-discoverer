import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";

interface Resource {
  id: string;
  title: string;
  description?: string;
  link?: string;
  major?: string;
  type?: string;
}

const subCategories: Record<string, string[]> = {
  "engineering": ["컴퓨터공학", "인공지능", "소프트웨어", "전자전기", "반도체", "로봇공학", "기계", "항공", "재료", "산업공학", "토목", "건축", "환경", "에너지"],
  "science": ["수학", "통계", "물리", "화학", "생명과학", "지구과학", "천문학", "데이터과학", "계산과학"],
  "humanities": ["철학", "역사", "문학", "언어학", "종교학", "문화연구", "고전학", "미학", "사상사"],
  "social": ["사회학", "심리학", "인류학", "정치외교", "행정", "법학", "미디어", "커뮤니케이션", "저널리즘"],
  "business": ["경영학", "마케팅", "회계", "재무", "경제학", "국제무역", "금융", "창업", "혁신", "조직관리"],
  "arts": ["디자인", "순수미술", "건축디자인", "음악", "연극", "영상", "영화", "체육", "무용", "패션"],
  "medicine": ["의학", "간호", "약학", "생명공학", "유전학", "뇌과학", "바이오헬스", "헬스케어", "재활"],
  "education": ["교육학", "교육공학", "교사교육", "평가", "상담", "평생교육", "학습심리"],
};

const categoryTitles: Record<string, string> = {
  "engineering": "공과대학",
  "science": "자연과학대학",
  "humanities": "인문대학",
  "social": "사회과학대학",
  "business": "경영경제대학",
  "arts": "예술체육대학",
  "medicine": "의생명대학",
  "education": "교육대학",
};

const CategoryResources = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("전체");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchResources = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        let queryBuilder = supabase
          .from("resources")
          .select("*");

        // Filter by category based on major field containing category keywords
        const keywords = subCategories[categoryId] || [];
        if (keywords.length > 0) {
          const orConditions = keywords.map(k => `major.ilike.%${k}%`).join(",");
          queryBuilder = queryBuilder.or(orConditions);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

        setResources(data || []);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast({
          title: "오류",
          description: "자료를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [categoryId, toast]);

  const handleBookmark = async (resource: Resource) => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "북마크 기능을 사용하려면 로그인하세요.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        title: resource.title,
        url: resource.link,
        description: resource.description,
        category: resource.major,
        bookmark_type: resource.type || "자료",
      });

      if (error) throw error;
      
      toast({
        title: "성공",
        description: "북마크에 추가되었습니다.",
      });
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast({
        title: "오류",
        description: "북마크 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const subCats = categoryId ? subCategories[categoryId] || [] : [];
  const categoryTitle = categoryId ? categoryTitles[categoryId] || "카테고리" : "카테고리";
  
  const filteredResources = selectedSubCategory === "전체" 
    ? resources
    : resources.filter(resource => resource.major === selectedSubCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로 가기
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{categoryTitle}</h1>
        </div>

        {subCats.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">세부 카테고리</h2>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedSubCategory === "전체" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSubCategory("전체")}
              >
                전체
              </Badge>
              {subCats.map((subCat: string, index: number) => (
                <Badge
                  key={index}
                  variant={selectedSubCategory === subCat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedSubCategory(subCat)}
                >
                  {subCat}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 자료 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">자료 목록</h2>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              로딩 중...
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="relative">
                  <ResourceCard
                    title={resource.title}
                    description={resource.description}
                    link={resource.link}
                    major={resource.major}
                    type={resource.type}
                  />
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(resource);
                      }}
                    >
                      <BookmarkPlus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              해당 카테고리의 자료가 없습니다.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryResources;

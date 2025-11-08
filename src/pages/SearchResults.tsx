import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedMajors, setRelatedMajors] = useState<string[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        let queryBuilder = supabase
          .from("resources")
          .select("*");

        if (query) {
          // Search in title, description, major, and type
          queryBuilder = queryBuilder.or(
            `title.ilike.%${query}%,description.ilike.%${query}%,major.ilike.%${query}%,type.ilike.%${query}%`
          );
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;

        setResources(data || []);
        
        // Extract unique majors for related categories
        const majors = [...new Set(data?.map(r => r.major).filter(Boolean))] as string[];
        setRelatedMajors(majors.slice(0, 6));
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
  }, [query, toast]);

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

  const handleMajorClick = (major: string) => {
    navigate(`/search?q=${encodeURIComponent(major)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">"{query}" 검색 결과</h1>
          <p className="text-muted-foreground">
            {loading ? "검색 중..." : `총 ${resources.length}개의 자료를 찾았습니다`}
          </p>
        </div>

        {/* 관련 전공 카테고리 */}
        {relatedMajors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">관련 전공</h2>
            <div className="flex flex-wrap gap-2">
              {relatedMajors.map((major, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleMajorClick(major)}
                >
                  {major}
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
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
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
              검색 결과가 없습니다. 다른 키워드로 검색해보세요.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;

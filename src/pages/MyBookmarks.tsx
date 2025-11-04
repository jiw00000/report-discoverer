import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Bookmark {
  id: string;
  title: string;
  url: string | null;
  description: string | null;
  category: string | null;
  bookmark_type: string;
  image_url: string | null;
  notes: string | null;
  created_at: string;
}

const MyBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchBookmarks();
  }, [user, navigate]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error: any) {
      toast({
        title: "오류",
        description: "북마크를 불러올 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase.from("bookmarks").delete().eq("id", id);

      if (error) throw error;

      setBookmarks(bookmarks.filter((b) => b.id !== id));
      toast({
        title: "삭제 완료",
        description: "북마크가 삭제되었습니다.",
      });
    } catch (error: any) {
      toast({
        title: "오류",
        description: "북마크를 삭제할 수 없습니다.",
        variant: "destructive",
      });
    }
  };

  const resourceBookmarks = bookmarks.filter((b) => b.bookmark_type === "resource");
  const imageBookmarks = bookmarks.filter((b) => b.bookmark_type === "image");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">내 과제함</h1>
            <p className="text-lg text-muted-foreground">
              저장한 자료와 이미지를 관리하세요
            </p>
          </div>

          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="resources">
                <FileText className="w-4 h-4 mr-2" />
                자료 ({resourceBookmarks.length})
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 mr-2" />
                이미지 ({imageBookmarks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="mt-6">
              {resourceBookmarks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      저장된 자료가 없습니다
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {resourceBookmarks.map((bookmark) => (
                    <Card key={bookmark.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {bookmark.title}
                            </CardTitle>
                            {bookmark.category && (
                              <span className="text-xs text-muted-foreground">
                                {bookmark.category}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBookmark(bookmark.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        {bookmark.description && (
                          <CardDescription>{bookmark.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {bookmark.notes && (
                          <p className="text-sm mb-3 text-muted-foreground">
                            메모: {bookmark.notes}
                          </p>
                        )}
                        {bookmark.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(bookmark.url!, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            링크 열기
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              {imageBookmarks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      저장된 이미지가 없습니다
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {imageBookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="overflow-hidden">
                      {bookmark.image_url && (
                        <img
                          src={bookmark.image_url}
                          alt={bookmark.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm">
                            {bookmark.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBookmark(bookmark.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      {bookmark.notes && (
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            메모: {bookmark.notes}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookmarks;

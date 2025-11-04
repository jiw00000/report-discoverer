import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ExternalLink, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
    download_location: string;
  };
}

const ImageSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("unsplash_api_key") || ""
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const searchImages = async () => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    if (!searchQuery.trim()) {
      toast({
        title: "검색어를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&per_page=12&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("이미지를 불러올 수 없습니다");
      }

      const data = await response.json();
      setImages(data.results);

      if (data.results.length === 0) {
        toast({
          title: "검색 결과가 없습니다",
          description: "다른 키워드로 검색해보세요",
        });
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "API 키를 확인하거나 잠시 후 다시 시도해주세요",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem("unsplash_api_key", apiKey);
    setShowApiKeyDialog(false);
    toast({
      title: "API 키가 저장되었습니다",
      description: "이제 이미지를 검색할 수 있습니다",
    });
  };

  const downloadImage = async (image: UnsplashImage) => {
    try {
      // Trigger download tracking
      if (apiKey) {
        fetch(image.links.download_location, {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        });
      }

      // Download image
      const response = await fetch(image.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `unsplash-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "다운로드 완료",
        description: "이미지가 다운로드되었습니다",
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "이미지를 다운로드할 수 없습니다",
        variant: "destructive",
      });
    }
  };

  const bookmarkImage = async (image: UnsplashImage) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "북마크를 사용하려면 로그인해주세요",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        title: image.alt_description || "Untitled",
        url: image.links.html,
        description: `Photo by ${image.user.name}`,
        bookmark_type: "image",
        image_url: image.urls.regular,
      });

      if (error) throw error;

      toast({
        title: "북마크 저장",
        description: "이미지가 내 과제함에 저장되었습니다",
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "북마크를 저장할 수 없습니다",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            저작권 걱정 없는 이미지 검색
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            리포트에 사용할 고품질 무료 이미지를 찾아보세요
            <br />
            <span className="text-sm">
              powered by{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Unsplash
              </a>
            </span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center">
              <Input
                type="text"
                placeholder="이미지 검색 (예: 비즈니스, 자연, 기술)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchImages()}
                className="text-base"
              />
            </div>
            <Button
              size="lg"
              onClick={searchImages}
              disabled={loading}
              className="px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "검색 중..." : "검색"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowApiKeyDialog(true)}
            >
              API 키 설정
            </Button>
          </div>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-video rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={image.urls.small}
                  alt={image.alt_description || "Unsplash image"}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm mb-3">
                      Photo by{" "}
                      <a
                        href={`https://unsplash.com/@${image.user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                      >
                        {image.user.name}
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => bookmarkImage(image)}
                        variant="secondary"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        북마크
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadImage(image)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(image.links.html, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Key Dialog */}
        <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unsplash API 키 설정</DialogTitle>
              <DialogDescription>
                무료 이미지를 검색하려면 Unsplash API 키가 필요합니다.
                <br />
                <a
                  href="https://unsplash.com/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  여기서
                </a>{" "}
                무료로 API 키를 받을 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="API 키를 입력하세요"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={saveApiKey} className="w-full">
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ImageSearch;

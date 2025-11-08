import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description?: string;
  link?: string;
  major?: string;
  type?: string;
}

const ResourceCard = ({ title, description, link, major, type }: ResourceCardProps) => {
  const handleClick = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg ${link ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {link && <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
        </div>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {major && (
            <Badge variant="outline" className="bg-primary/10">
              {major}
            </Badge>
          )}
          {type && (
            <Badge variant="secondary">
              #{type}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;

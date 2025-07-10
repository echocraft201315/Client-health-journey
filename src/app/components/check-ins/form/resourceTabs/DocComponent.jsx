import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/app/components/ui/card";
import { FileText, Download, Eye, FolderOpen } from "lucide-react";

const DocEditComponent = ({ text }) => {
  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow w-full">
        <a href={text.content} target="_blank" rel="noopener noreferrer">
          <CardContent className="p-4 px-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="text-primary h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{text.title}</h3>
                  {text.isNew && (
                    <Badge variant="secondary" className="h-5 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {text.description}
                </p>
              </div>
            </div>
          </CardContent>
        </a>
      </Card>
    </>
  );
};

export default DocEditComponent;

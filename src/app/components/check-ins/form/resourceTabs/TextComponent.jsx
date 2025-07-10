"use client";

import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/app/components/ui/card";
import { FileText, Download, Eye, FolderOpen } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import DOMPurify from "dompurify";

const TextComponent = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sanitizedHtml = DOMPurify.sanitize(text.content);

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow w-full"
        onClick={() => {
          setIsOpen(true);
        }}
      >
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
                {text.subtitle}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-[500px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{text.title}</DialogTitle>
            <DialogDescription>{text.subtitle}</DialogDescription>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TextComponent;

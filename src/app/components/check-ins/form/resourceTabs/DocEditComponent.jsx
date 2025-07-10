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
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/app/components/ui/input";

const DocEditComponent = ({ text, getAllTexts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, submittedData] = useState({
    title: text.title,
    description: text.description,
    role: text.role,
    category: text.category,
    type: "Doc",
    content: text.content,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/resource/html/${text.id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData.status) {
        toast.success("Resource deleted successfully");
        setIsSubmitting(false);
        getAllTexts();
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/resource/html/${text.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        setIsEditing(false);
        toast.success("Resource updated successfully");
        setIsSubmitting(false);
        getAllTexts();
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

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
                {text.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-[500px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="w-full">
            <DialogTitle className="break-words whitespace-pre-line">
              {text.title}
            </DialogTitle>
            <DialogDescription className="break-words break-all whitespace-pre-line">
              {text.description}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full break-all whitespace-pre-line">
            {text.content}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="mr-2" onClick={handleEdit}>
              <a href={text.content} target="_blank" rel="noopener noreferrer">
                Edit
              </a>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="w-full max-w-xs sm:max-w-[500px] p-4 sm:p-6 max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit document</DialogTitle>
            <DialogDescription>Edit the document.</DialogDescription>
          </DialogHeader>
          <Input
            name="title"
            placeholder={text.title}
            onChange={(e) =>
              submittedData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <Input
            name="description"
            placeholder={text.description}
            onChange={(e) =>
              submittedData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <div>
            <Label htmlFor="role" className="mb-[10px]">
              To show
            </Label>
            <Select
              name="role"
              value={data.role}
              onValueChange={(e) =>
                submittedData((prev) => ({ ...prev, ["role"]: e }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the role to show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category" className="mb-[10px]">
              Category
            </Label>
            <Select
              name="category"
              value={data.category}
              onValueChange={(e) =>
                submittedData((prev) => ({ ...prev, ["category"]: e }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guides">Guides</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="protocols">Protocols</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category" className="mb-[10px]">
              URL
            </Label>
            <Input
              name="content"
              placeholder={data.content}
              onChange={(e) =>
                submittedData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-self-end">
            <Button
              onClick={handleSubmit}
              className="mr-[10px]"
              disabled={isSubmitting}
            >
              Save{" "}
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocEditComponent;

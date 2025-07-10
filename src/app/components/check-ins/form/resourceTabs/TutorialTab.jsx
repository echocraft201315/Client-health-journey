"use client";
import { Editor } from "primereact/editor";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import TextEditComponent from "./TextEditComponent";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TextComponent from "./TextComponent"
import { useAuth } from "@/app/context/AuthContext";

const TutorialTab = () => {
  const {user} = useAuth();
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, submittedData] = useState({
    title: "",
    description: "",
    role: "",
    category:"",
    type: "HTML",
    content: "",
  });
  const [texts, setAlltexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddlclientdialogue = () => {
    onOpenChange(true);
  };
  const isAdmin = user?.role === "admin";
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/resource/html`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        onOpenChange(false);
        toast.success("add a resource successfully");
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

  const getAllTexts = async () => {
    try {
      setIsLoading(true);
      const responsse = await fetch("/api/admin/resource/html");
      const responseData = await responsse.json();
      if (responseData.status) {
        setAlltexts(responseData.texts);
        setIsLoading(false);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTexts();
  }, []);

  return (
    <div className="w-full max-w-3xl px-2 py-4">
      {isLoading?
       (<div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>)
      :
      (
      isAdmin?
      (<>
      <Button onClick={handleAddlclientdialogue} className="mb-4 w-full sm:w-auto">
        <UserPlus className="mr-2 h-4 w-4" />
        Add document
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-xs sm:max-w-[500px] p-4 sm:p-6 max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New document</DialogTitle>
            <DialogDescription>Create a new document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 w-full">
            <Input
              name="title"
              placeholder="Title"
              onChange={(e) =>
                submittedData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full"
            />
            <Input
              name="description"
              placeholder="description"
              onChange={(e) =>
                submittedData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full"
            />
            <div>
              <Label htmlFor="role" className="mb-2">
                To show
              </Label>
              <Select
                name="role"
                value={data.role}
                onValueChange={(e) =>
                  submittedData((prev) => ({ ...prev, ["role"]: e }))
                }
              >
                <SelectTrigger className="w-full">
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
              <Label htmlFor="category" className="mb-2">
                Category
              </Label>
              <Select
                name="category"
                value={data.category}
                onValueChange={(e) =>
                  submittedData((prev) => ({ ...prev, ["category"]: e }))
                }
              >
                <SelectTrigger className="w-full">
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
            <Editor
              value={data.content}
              onTextChange={(e) =>
                submittedData((prev) => ({ ...prev, ["content"]: e.htmlValue }))
              }
              style={{ height: "320px" }}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 w-full">
              <Button
                onClick={handleSubmit}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {texts
          ? texts.map((value, key) => <TextEditComponent text={value} key={key} getAllTexts={getAllTexts} />)
          : ""}
      </div>
    </>):(
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {texts
          ? texts.map((value, key) => <TextComponent text={value} key={key} getAllTexts={getAllTexts} />)
          : ""}
      </div>
    )
    )}
    </div>
  );
};
export default TutorialTab;

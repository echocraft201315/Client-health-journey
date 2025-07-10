"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { FileText, Sparkles, Plus } from "lucide-react"
import ProgramDetailsCard from "@/app/components/programs/ProgramDetailsCard"
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useEffect} from "react";
import { toast } from "sonner";
import TempTableForProgram from "../../components/programs/TempTableForProgram";
import TemplateDetailsDialog from "../../components/programs/TemplateDetailsDialog";
import  EditProgramDialogue  from "@/app/components/programs/EditProgramDialogue";
import ProgramTable from "@/app/components/programs/ProgramTable"

export default function ProgramsPage() {
  const [currentStep, setCurrentStep] = useState("")
  const [Templates, setTemplates] = useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isTemplateError, setIsTemplateError] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [Programs, setPrograms] = useState([]);
  const [isProgramLoading, setIsProgramLoading] = useState(false);
  const [isProgramError, setIsProgramError] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showEditDialogue, setEditDialogue] = useState(false);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const fetchTemplates = async () => {
    try {
      setIsTemplateLoading(true);
      const response = await fetch("/api/admin/template");
      const data = await response.json();
      setTemplates(data.templates);
      setIsTemplateLoading(false);
      setIsTemplateError(false);
    } catch (error) {
      console.log(error);
      setIsTemplateError(true);
      toast.error("Failed to fetch templates");
    }
  };
  const fetchPrograms = async () => {
    try {
      setIsProgramLoading(true);
      const response = await fetch("/api/clinic/program");
      const data = await response.json();
      setPrograms(data.programs);
      setIsProgramLoading(false);
      setIsProgramError(false);
    } catch (error) {
      console.log(error);
      setIsProgramError(true);
      toast.error("Failed to fetch programs");
    }
  };
  useEffect(() => {
    fetchTemplates();
    fetchPrograms();
  }, []);

  const handleCreateProgramWithTemplate = (template) => {
    setSelectedTemplate(template);
    setOpen(true);
  };

  const onEdit = (program) => {
    setSelectedProgram(program);
    setEditDialogue(true);
  }

 const onDelete =async (data) => {

      try {
        const response = await fetch(`/api/admin/program/${data}`, {
          method: "DELETE",
          body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (responseData.status) {
          await fetchPrograms();
          toast.success("Program deleted successfully");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete program");
      }
  }

  const handleViewProgramDetails = (program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 w-full max-w-5xl mx-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <EditProgramDialogue
          open={showEditDialogue}
          setOpen={setEditDialogue}
          fetchTemplates={fetchPrograms}
          selectedTemplate = {selectedProgram}
        />

        {/* Template Details Dialog */}
        <TemplateDetailsDialog
          template={selectedProgram}
          isOpen={showProgramDetails}
          onClose={() => setShowProgramDetails(false)}
        />
        <Card className="pb-0">
            <CardHeader className="text-2xl font-semibold">
            All Programs
            </CardHeader>
          <Card className="max-h-[250px] overflow-y-scroll p-3">
          <ProgramTable 
        Programs={Programs} 
        isProgramLoading={isProgramLoading} 
        isProgramError={isProgramError}
        onSelectProgram={handleViewProgramDetails}
        selectedProgram={selectedProgram}
        onEdit={onEdit}
        onDelete={onDelete}/>
          </Card>
        
        </Card>
       
        {/* Template Selection Summary */}
        <Card>
          <CardHeader className="text-2xl font-semibold">
            Create New Programs
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-4 sm:p-6 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <Card  className="bg-white/10 border-2 border-white/20 hover:border-white/40 cursor-pointer transition-all hover:bg-blue-50 transition-colors hover: cursor-pointer"
                onClick={() => setCurrentStep("Existing_Template")}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Use Existing Template</h3>
                    <p className="text-xs opacity-90">Start with a proven program template and customize as needed</p>
                  </CardContent>
                </Card>
                <Card  className="bg-white/10 border-2 border-white/20 hover:border-white/40 cursor-pointer transition-all hover:bg-blue-50 transition-colors hover: cursor-pointer"
                onClick={() => setOpen(true)}
                >
                  <CardContent className="p-4 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Create from Scratch</h3>
                    <p className="text-xs opacity-90">Build a completely custom program from the ground up</p>
                  </CardContent>
                </Card>
              </div>
              {(currentStep === "Existing_Template") && (
                <>
                <h3 className="font-semibold mb-4">Select a Template</h3>
                {isTemplateLoading ? (
              <div className="flex flex-col md:flex-row h-[200px] w-full space-y-3 md:space-y-0 md:space-x-3">
              <Skeleton className="h-full w-full md:w-1/3" />
              <Skeleton className="h-full w-full md:w-1/3" />
              <Skeleton className="h-full w-full md:w-1/3" />
              </div>
     
          ) : isTemplateError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load Templates. Please try again.
            </div>
          ) : Templates && Templates.length > 0 ? (
            <Card className="max-h-[300px] overflow-y-scroll p-3">
            <TempTableForProgram
              Templates={Templates}
              isTemplateLoading={false}
              isTemplateError={false}
              onSelectTemplate={handleCreateProgramWithTemplate}
              selectedTemplate = {selectedTemplate}

            />
            </Card>

          ) : (
            <div className="text-center py-8 text-gray-500">
              No Templates found. Click "Add Template" to create one.
            </div>
          )}
                </>
              )}
            </div>
          </CardContent>
        </Card>       
          <ProgramDetailsCard open = {open} setOpen = {setOpen} selectedTemplate={selectedTemplate} fetchPrograms={fetchPrograms}/>
      </div>
    </div>
  )
}

import React, { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "@/app/context/AuthContext";
const ProgramTable = ({
  Programs,
  isProgramLoading,
  isProgramError,
  onSelectProgram,
  selectedProgram,
  onEdit,
  onDelete,
}) => {
  const {user} = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  if (isProgramLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (isProgramError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load Programs. Please try again.
      </div>
    );
  }

  if (!Programs || Programs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No Programs found. Click "Add Program" to create one.
      </div>
    );
  }

  const handleProgramClick = (Program) => {
    if (onSelectProgram) {
      onSelectProgram(Program);
    }
  };

  const handleEdit = (e, Program) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(Program);
    }
  };

  const handleDelete = async (e, Program) => {
    e.stopPropagation();
    if (onDelete) {
      setDeletingId(Program.id);
      try {
        await onDelete(Program.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {Programs.map((Program, index) => (
        <Card
          key={Program.id}
          className={`bg-white cursor-pointer transition-all hover:shadow-md hover:bg-blue-50 w-full ${
            selectedProgram?.id === Program.id
              ? "ring-2 ring-blue-500 bg-blue-50"
              : ""
          }`}
          onClick={() => handleProgramClick(Program)}
        >
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-1">
              {/* <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                {Program.program_type}
              </span> */}
              {
                (Program.clinicId && user.role == "clinic_admin") || user.role == "admin" || (user.role =="coach" && Program.all == "coach")?
                (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-200"
                    onClick={(e) => handleEdit(e, Program)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-200"
                    onClick={(e) => handleDelete(e, Program)}
                    disabled={deletingId === Program.id}
                  >
                    {deletingId === Program.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                ):(
                  ""
                )
              }
              
            </div>
            <h4 className="font-semibold text-gray-800 text-sm mb-1">
              {Program.program_name}
            </h4>
            <p className="text-xs text-gray-600 mb-2">{Program.description}</p>
            <div className="text-xs text-gray-500">
              {Program.program_length} • {Object.entries(JSON.parse(Program.goals))
                .filter(([_, value]) => value)
                .map(([key]) => key).join(" • ")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgramTable;

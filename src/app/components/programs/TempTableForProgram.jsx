import React, { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import PropTypes from 'prop-types';

const TempTableForProgram = ({
  Templates,
  isTemplateLoading,
  isTemplateError,
  onSelectTemplate,
  selectedTemplate,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  if (isTemplateLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isTemplateError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load Templates. Please try again.
      </div>
    );
  }

  if (!Templates || Templates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No Templates found. Click "Add Template" to create one.
      </div>
    );
  }

  const handleTemplateClick = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {Templates.map((template) => (
        <Card
          key={template.id}
          className={`bg-white cursor-pointer transition-all hover:shadow-md hover:bg-blue-150 w-full ${
            selectedTemplate?.id === template.id
              ? "ring-2 ring-green-500 bg-green-50"
              : ""
          }`}
          onClick={() => handleTemplateClick(template)}
        >
          <CardContent className="p-3">
            {/* <div className="flex justify-between items-start mb-1">
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                {template.program_type}
              </span>
            </div> */}
            <h4 className="font-semibold text-gray-800 text-sm mb-1">
              {template.program_name}
            </h4>
            <p className="text-xs text-gray-600 mb-2">{template.description}</p>
            <div className="text-xs text-gray-500">
              {template.program_length} • {Object.entries(JSON.parse(template.goals))
                .filter(([_, value]) => value)
                .map(([key]) => key).join(" • ")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TempTableForProgram;

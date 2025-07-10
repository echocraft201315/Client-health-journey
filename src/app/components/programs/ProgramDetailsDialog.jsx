import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, ListCheck } from "lucide-react";
import { Separator } from "../../components/ui/separator";

const ProgramDetailsDialog = ({ program, isOpen, onClose }) => {
  if (!program) return null;

  const formatDuration = (days) => {
    if (days === 30) return "30 days";
    if (days === 60) return "60 days";
    if (days % 7 === 0) {
      const weeks = days / 7;
      return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
    }
    return `${days} days`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-full max-w-[98vw] p-4 sm:p-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {program.name
              ? program.name
              : `${program.template.type
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())} Program`}
          </DialogTitle>
          {/* <DialogDescription>
            {program.type ? program.type : program.template.type} program
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Duration: {formatDuration(program.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                Check-in:{" "}
                {program.checkInFrequency === "daily" ? "Daily" : "Weekly"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1">Description</h3>
            <p className="text-sm text-gray-600">{program.description}</p>
          </div>

          {program.supplements && program.supplements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <ListCheck className="h-4 w-4" />
                  <span>Supplements ({program.supplements.length})</span>
                </h3>
                <div className="space-y-3">
                  {program.supplements.map((supplement) => (
                    <div
                      key={supplement.id}
                      className="bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{supplement.name}</h4>
                        <Badge variant="outline">{supplement.frequency}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {supplement.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Dosage:</span>{" "}
                        {supplement.dosage}
                        {supplement.timeOfDay && (
                          <span className="ml-2">
                            <span className="font-medium">When:</span>{" "}
                            {supplement.timeOfDay}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {
            <>
              <div className="text-sm font-semibold mb-1">Template</div>{" "}
              <div className="text-sm text-gray-600">
                {program.template?.description}
              </div>
            </>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailsDialog;

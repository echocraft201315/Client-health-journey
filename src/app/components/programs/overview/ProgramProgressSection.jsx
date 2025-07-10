import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";

const ProgramProgressSection = () => {
  const progressPercent = 67;

  return (
    <div>
      <h3 className="font-medium mb-3">Program Progress</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4">
        <Button asChild size="sm" variant="outline" className="gap-2">
          <Link href="/check-in">
            <Calendar size={16} /> Record Today's Check-in
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProgramProgressSection;

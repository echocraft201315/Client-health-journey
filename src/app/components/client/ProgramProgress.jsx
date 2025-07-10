import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ProgramProgress = () => {
  const progressPercent = 25;
  const programName = "okay";
  const clientStartDate = "2023-10-10";

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="px-2 sm:px-4">
        <CardTitle className="text-base sm:text-xl">Program Progress</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {programName ? `${programName}` : "Your current program"}
          {clientStartDate &&
            ` - Started ${new Date(clientStartDate).toLocaleDateString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="mt-6">
          <Button asChild size="sm" className="gap-2 w-full sm:w-auto">
            <Link href="/client/check-in">
              Record Today's Check-In <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramProgress;

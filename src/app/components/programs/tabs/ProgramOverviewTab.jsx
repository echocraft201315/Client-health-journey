import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import ProgramProgressSection from "../overview/ProgramProgressSection";
import DailyRequirements from "../overview/DailyRequirements";
import MilestonesList from "../milestones/MilestonesList";

const ProgramOverviewTab = () => {
  const programName = "okay1";
  const clientStartDate = "4/11/2025";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {programName || "Your Program"}
        </CardTitle>
        {clientStartDate && (
          <CardDescription>
            Started on {new Date(clientStartDate).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgramProgressSection />

        <Separator />

        <DailyRequirements />

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Upcoming Milestones</h3>
          <MilestonesList />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramOverviewTab;

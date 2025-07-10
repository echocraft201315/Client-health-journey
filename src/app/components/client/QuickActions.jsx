import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { Scale, BarChart2 } from "lucide-react";

const QuickActions = () => {
  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-2 px-2 sm:px-4">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Button asChild variant="outline" className="h-16 sm:h-20 flex flex-col w-full">
            <Link href="/client/check-in">
              <Scale className="h-5 w-5 mb-1" />
              <span className="text-xs sm:text-base">Check-In</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-16 sm:h-20 flex flex-col w-full">
            <Link href="/client/program">
              <BarChart2 className="h-5 w-5 mb-1" />
              <span className="text-xs sm:text-base">My Program</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

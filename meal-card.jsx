"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const Nutrient = ({
  value,
  label,
  color
}) => {
  return (
    <div className={`p-4 rounded-md ${color}`}>
      <div className="text-xl font-bold">{value}g</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function MealCard() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Breakfast</CardTitle>
          <p className="text-sm text-muted-foreground">8:30 AM</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Nutrition Breakdown:</h3>
          <div className="grid grid-cols-2 gap-3">
            <Nutrient value={25} label="Protein" color="bg-blue-50" />
            <Nutrient value={22} label="Carbs" color="bg-orange-50" />
            <Nutrient value={15} label="Fat" color="bg-purple-50" />
            <Nutrient value={6} label="Fiber" color="bg-green-50" />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">AI Analysis:</h3>
          <p className="text-sm text-gray-600">
            Excellent protein start to your day! The probiotics in Greek yogurt support gut health.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md text-center">
          <div className="text-2xl font-bold text-orange-500">320</div>
          <div className="text-sm text-gray-500">Total Calories</div>
        </div>
      </CardContent>
    </Card>
  );
}

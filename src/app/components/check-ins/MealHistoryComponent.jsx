import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Utensils } from "lucide-react";

const MealHistoryComponent = ({ checkIn }) => {
    const formatNutrition = (nutrition) => {
        try {
            // Parse the nutrition data if it's a string
            const nutritionData = typeof nutrition === 'string' ? JSON.parse(nutrition) : nutrition;

            if (!nutritionData || !Array.isArray(nutritionData)) return [];

            return nutritionData.map((item, index) => ({
                id: index + 1,
                protein: item.protein || "N/A",
                proteinPortion: item.proteinPortion ? `${item.proteinPortion} oz` : "N/A",
                fruit: item.fruit || "N/A",
                fruitPortion: item.fruitPortion ? `${item.fruitPortion} oz` : "N/A",
                vegetables: item.vegetables || "N/A",
                vegetablesPortion: item.vegetablesPortion ? `${item.vegetablesPortion} oz` : "N/A",
                carbs: item.carbs || "N/A",
                carbsPortion: item.carbsPortion ? `${item.carbsPortion} oz` : "N/A",
                fats: item.fats || "N/A",
                fatsPortion: item.fatsPortion ? `${item.fatsPortion} oz` : "N/A",
                other: item.other || "N/A",
                otherPortion: item.otherPortion ? `${item.otherPortion} oz` : "N/A",
            }));
        } catch (error) {
            console.error("Error parsing nutrition data:", error);
            return [];
        }
    };

    const nutritionEntries = formatNutrition(checkIn.nutrition);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    <CardTitle>Meal History</CardTitle>
                </div>
                <CardDescription>Nutrition details from your check-in</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {nutritionEntries.length > 0 ? (
                        nutritionEntries.map((entry) => (
                            <div key={entry.id} className="space-y-4">
                                <h4 className="font-medium">Meal Set {entry.id}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Protein</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.protein} ({entry.proteinPortion})
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Fruit</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.fruit} ({entry.fruitPortion})
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Vegetables</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.vegetables} ({entry.vegetablesPortion})
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Carbs</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.carbs} ({entry.carbsPortion})
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Fats</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.fats} ({entry.fatsPortion})
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Other</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.other} ({entry.otherPortion})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No nutrition data available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MealHistoryComponent; 
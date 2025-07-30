import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

const MealHistoryComponent = ({ checkIn }) => {
  console.log("checkInoooo",checkIn);
  return (
    <Card className="mx-0 sm:mx-[24px] p-0">
      <CardHeader className="bg-[#F9FAFB]">
        <CardTitle className="text-sm sm:text-[14px] font-semibold pt-6 pb-3">
          {checkIn && checkIn.selectedDate
            ? (() => {
                try {
                  return new Date(checkIn.selectedDate).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "UTC",
                  });
                } catch (error) {
                  return "Invalid Date";
                }
              })()
            : "No Date"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm sm:text-[14px] pb-6 px-1 sm:px-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {JSON.parse(checkIn?.nutrition || '[]').map((nutrition, index) => (
            <div key={index} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary-600">Meal {index + 1}</h4>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  <div>
                    <p className="text-sm"><span className="font-medium text-gray-500">Protein: </span><span className = "text-green-500">{nutrition.protein || '-'} oz</span></p>
                    <p className="text-sm"><span className="font-medium text-gray-500">Protein Portion: </span><span className = "text-green-500">{nutrition.proteinPortion || '-'} oz</span></p>
                  </div>
                  <div>
                  <p className="text-sm"><span className="font-medium text-gray-500">Fruit: </span><span className = "text-green-500">{nutrition.fruit || '-'} oz</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Fruit Portion: </span><span className = "text-green-500">{nutrition.fruitPortion || '-'} oz</span></p>
                  </div>
                  <div>
                  <p className="text-sm"><span className="font-medium text-gray-500">Vegetables: </span><span className = "text-green-500">{nutrition.vegetables || '-'} oz</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Vegetables Portion: </span><span className = "text-green-500">{nutrition.vegetablesPortion || '-'} oz</span></p>
                  </div>
                  <div>
                  <p className="text-sm"><span className="font-medium text-gray-500">Carbs: </span><span className = "text-green-500">{nutrition.carbs || '-'} oz</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Carbs Portion: </span><span className = "text-green-500">{nutrition.carbsPortion || '-'} oz</span></p>
                  </div>
                  <div>
                  <p className="text-sm"><span className="font-medium text-gray-500">Fats: </span><span className = "text-green-500">{nutrition.fats || '-'} oz</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Fats Portion: </span><span className = "text-green-500">{nutrition.fatsPortion || '-'} oz</span></p>
                  </div>
                  <div>
                  <p className="text-sm"><span className="font-medium text-gray-500">Other: </span><span className = "text-green-500">{nutrition.other || '-'} oz</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Other Portion: </span><span className = "text-green-500">{nutrition.otherPortion || '-'} oz</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <div className="text-[#020817] mt-2 font-bold mb-2">suppliments</div>
        <div className="flex flex-wrap gap-2">
          {checkIn?.supplements.split(",").map((item, index) => (
            <Badge
              className="bg-cyan-100-100 text-cyan-800 hover:bg-green-200 text-xs sm:text-sm px-2 py-1"
              variant="outline"
              key={index}
            >
              {item.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default MealHistoryComponent;

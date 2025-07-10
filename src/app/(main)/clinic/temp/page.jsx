"use client";
import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import {
  TrendingUp,
  Utensils,
  BarChart3,
  Bot,
  Heart,
  Target,
  Droplet,
  Activity,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from "@/app/components/ui/dialog";
export default function HealthTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);
  const Nutrient = ({ value, label, color }) => {
    return (
      <div className={`p-4 rounded-md ${color}`}>
        <div className="text-xl font-bold">{value}g</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    );
  };
  const showDetails = () => {
    setIsOpen(true);
  };
  // Tab Button Component
  const TabButton = ({ tab, icon: Icon, label, isActive }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 ${
        isActive ? "bg-blue-600 text-white" : "text-gray-600"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
  function getMacroIcon(label) {
    switch (label) {
      case "Water":
        return <Droplet className="w-3 h-3  text-blue-400" />;
      case "Protein":
        return <Target className="w-3 h-3 text-blue-500" />;
      case "Carbs":
        return <Target className="w-3 h-3 text-orange-500" />;
      case "Fat":
        return <Target className="w-3 h-3 text-purple-500" />;
      case "Calories":
        return <Activity className="w-3 h-3 text-red-500" />;
      case "Fiber":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  }
  function getMealIcon(meal) {
    switch (meal) {
      case "Breakfast":
        return <>🥗</>;
      case "Lunch":
        return <>🥙</>;
      case "Dinner":
        return <>🍝</>;
      case "Snack":
        return <>🥗</>;
      default:
        return null;
    }
  }

  // Macro Bar Component
  const MacroBar = ({ label, current, total, unit = "g" }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div>{getMacroIcon(label)}</div>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium">
        {current}/{total}
        {unit}
      </span>
    </div>
  );

  // Meal Card Component
  const MealCard = ({
    meal,
    time,
    items,
    calories,
    protein,
    macros,
    color,
    review,
    bgColor,
  }) => (
    <>
      <Card
        className="p-4 space-y-3 hover:cursor-pointer"
        onClick={showDetails}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{meal}</h3>
            <p className="text-sm text-gray-500">{time}</p>
            <p className="text-sm text-gray-700 mt-1">{items}</p>
          </div>
          <div className="text-right">
            <div>{getMealIcon(meal)}</div>
            <p className="text-sm font-medium">{calories} cal</p>
            <p className="text-sm font-medium">{protein}g protein</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-100 rounded p-2 text-center">
            <p className="text-xs text-blue-600">Protein</p>
            <p className="text-sm font-medium text-blue-700">
              {macros.protein}g
            </p>
          </div>
          <div className="flex-1 bg-orange-100 rounded p-2 text-center">
            <p className="text-xs text-orange-600">Carbs</p>
            <p className="text-sm font-medium text-orange-700">
              {macros.carbs}g
            </p>
          </div>
          <div className="flex-1 bg-purple-100 rounded p-2 text-center">
            <p className="text-xs text-purple-600">Fat</p>
            <p className="text-sm font-medium text-purple-700">{macros.fat}g</p>
          </div>
        </div>
        <div className={` p-2 rounded text-xs ${color} ${bgColor}`}>
          {review}
        </div>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay className="bg-gray-100/30" /> {/* Light gray with 30% opacity */}
        <DialogContent className="w-full max-w-md shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-medium">Breakfast</CardTitle>
                <p className="text-sm text-muted-foreground">8:30 AM</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div>
            <h3 className="font-medium mb-2">Nutrition Breakdown:</h3>
            <div className="grid grid-cols-2 gap-3">
              <Nutrient value={25} label="Protein" color="bg-blue-50 text-blue-600" />
              <Nutrient value={22} label="Carbs" color="bg-orange-50 text-orange-600" />
              <Nutrient value={15} label="Fat" color="bg-purple-50 text-purple-600" />
              <Nutrient value={6} label="Fiber" color="bg-green-50 text-green-600" />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">AI Analysis:</h3>
            <p className="text-sm text-gray-600">
              Excellent protein start to your day! The probiotics in Greek
              yogurt support gut health.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-orange-500">320</div>
            <div className="text-sm text-gray-500">Total Calories</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // Recipe Card Component
  const RecipeCard = ({
    title,
    description,
    calories,
    protein,
    macros,
    ingredients,
  }) => (
    <Card className="p-4 flex flex-col gap-y-1">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{calories} cal</span>
        <span className="text-sm font-medium">{protein}g protein</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-blue-100 rounded p-2 text-center">
          <p className="text-xs text-blue-600">Protein</p>
          <p className="text-sm font-medium text-blue-700">{macros.protein}g</p>
        </div>
        <div className="flex-1 bg-orange-100 rounded p-2 text-center">
          <p className="text-xs text-orange-600">Carbs</p>
          <p className="text-sm font-medium text-orange-700">{macros.carbs}g</p>
        </div>
        <div className="flex-1 bg-purple-100 rounded p-2 text-center">
          <p className="text-xs text-purple-600">Fat</p>
          <p className="text-sm font-medium text-purple-700">{macros.fat}g</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Ingredients:</p>
        <p className="text-sm text-gray-600">{ingredients}</p>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700">
        Get Full Recipe
      </Button>
    </Card>
  );

  // Trend Chart Component
  const TrendChart = ({ title, color, data }) => (
    <Card className="pl-2 pr-2 pt-4 pb-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="flex gap-1 h-16 items-end">
          {data.map((value, index) => (
            <div
              key={index}
              className={`flex-1 ${color} rounded-sm`}
              style={{ height: `${(value / Math.max(...data)) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1F2937]">
                Welcome back, Sarah Johnson!
              </h1>
              <span className="text-2xl">👋</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Weight Loss Phase 1 • Started Jan 15, 2025
            </p>
          </CardHeader>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">8.2/10</div>
              <div className="text-xs text-gray-500">Excellent</div>
              <div className="text-xs text-gray-500">Weekly Compliance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">142 lbs</div>
              <div className="text-xs text-gray-500">Current Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">135 lbs</div>
              <div className="text-xs text-gray-500">Goal Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">-1.5 lbs</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
          </div>
        </Card>

        <div className="flex gap-2 flex-wrap bg-white rounded-[4px] p-1 shadow-md">
          <TabButton
            tab="overview"
            icon={BarChart3}
            label="Overview"
            isActive={activeTab === "overview"}
          />
          <TabButton
            tab="meals"
            icon={Utensils}
            label="Today's Meals"
            isActive={activeTab === "meals"}
          />
          <TabButton
            tab="trends"
            icon={TrendingUp}
            label="Trends"
            isActive={activeTab === "trends"}
          />
          <TabButton
            tab="recipes"
            icon={Bot}
            label="AI Recipes"
            isActive={activeTab === "recipes"}
          />
        </div>
        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* AI Health Assistant */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5" />
                <h2 className="font-semibold">Your AI Health Assistant 🤖</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-award w-5 h-5 text-yellow-500"
                  >
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                    <circle cx="12" cy="8" r="6"></circle>
                  </svg>
                  <p className="text-sm">
                    You've hit your protein goals 5 days this week! 🎉
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm">
                    Your hydration drops on weekends. Try setting phone
                    reminders!
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                  <Heart className="w-4 h-4 text-pink-600 mt-0.5" />
                  <p className="text-sm">
                    Progress, not perfection. You're doing more than you think!
                    💪
                  </p>
                </div>
              </div>
            </Card>
            {/* Today's Macros */}
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Today's Macros</h2>
              <div className="space-y-2">
                <MacroBar label="Water" current={6} total={8} unit=" glasses" />
                <MacroBar label="Protein" current={78} total={85} />
                <MacroBar label="Carbs" current={135} total={150} />
                <MacroBar label="Fat" current={61} total={65} />
                <MacroBar
                  label="Calories"
                  current={1455}
                  total={1500}
                  unit=""
                />
                <MacroBar label="Fiber" current={18} total={25} />
              </div>
            </Card>
          </div>
        )}
        {activeTab === "meals" && (
          <div className="space-y-4">
            <MealCard
              meal="Breakfast"
              time="8:30 AM"
              items="Greek yogurt, Blueberries, Almonds"
              calories={320}
              protein={25}
              macros={{ protein: 25, carbs: 22, fat: 15 }}
              color="text-green-700"
              bgColor="bg-green-50"
              review="Excellent protein start to your day! The probiotics in Greek yogurt
        support gut health."
            />
            <MealCard
              meal="Lunch"
              time="12:45 PM"
              items="Grilled chicken wrap, Mixed greens, Hummus"
              calories={485}
              protein={35}
              macros={{ protein: 35, carbs: 38, fat: 18 }}
              color="text-yellow-700"
              bgColor="bg-yellow-50"
              review="Great lean protein choice! Consider adding more vegetables next time. protein start to your day! The probiotics in Greek yogurt
        support gut health."
            />
            <MealCard
              meal="Dinner"
              time="7:15 PM"
              items="Pasta, Alfredo sauce, Side salad"
              calories={650}
              protein={18}
              macros={{ protein: 18, carbs: 75, fat: 28 }}
              color="text-red-700"
              bgColor="bg-red-50"
              review="Try swapping regular pasta for zucchini noodles to cut calories while keeping that creamy flavor you love!"
            />
          </div>
        )}
        {activeTab === "trends" && (
          <div className="space-y-6">
            {/* Daily Averages */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">78g</div>
                  <div className="text-xs text-gray-500">Avg Daily Protein</div>
                  <div className="text-xs text-gray-500">5 day avg week</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">142g</div>
                  <div className="text-xs text-gray-500">Avg Daily Carbs</div>
                  <div className="text-xs text-gray-500">7 day avg week</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">49g</div>
                  <div className="text-xs text-gray-500">Avg Daily Fat</div>
                  <div className="text-xs text-gray-500">5g avg last week</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">24g</div>
                  <div className="text-xs text-gray-500">Avg Daily Fiber</div>
                  <div className="text-xs text-gray-500">3g avg last week</div>
                </div>
              </Card>
            </div>
            {/* Trend Charts */}
            <div className="grid grid-cols-1 gap-6">
              <TrendChart
                title="Weight Trend"
                color="bg-blue-400"
                data={[142, 141.5, 141, 140.5, 140, 139.5, 139]}
              />
              <TrendChart
                title="Protein Trend"
                color="bg-blue-500"
                data={[75, 80, 78, 85, 82, 79, 88]}
              />
              <TrendChart
                title="Carbs Trend"
                color="bg-orange-400"
                data={[140, 135, 150, 145, 138, 142, 148]}
              />
              <TrendChart
                title="Fat Trend"
                color="bg-purple-400"
                data={[45, 50, 48, 52, 49, 47, 51]}
              />
              <TrendChart
                title="Fiber Trend"
                color="bg-green-400"
                data={[20, 22, 25, 23, 28, 24, 26]}
              />
              <TrendChart
                title="Compliance Trend"
                color="bg-indigo-400"
                data={[8, 9, 7, 8.5, 9, 8, 8.5]}
              />
            </div>
          </div>
        )}
        {activeTab === "recipes" && (
          <div className="space-y-6">
            <RecipeCard
              title="Protein-Packed Breakfast Bowl"
              description="Based on your love for morning protein!"
              calories={340}
              protein={32}
              macros={{ protein: 32, carbs: 24, fat: 12 }}
              ingredients="Greek yogurt, Chia seeds, Berries, Protein powder"
            />
            <RecipeCard
              title="Zucchini Noodle Alfredo"
              description="Healthier swap for tonight's pasta craving"
              calories={385}
              protein={38}
              macros={{ protein: 38, carbs: 15, fat: 22 }}
              ingredients="Zucchini, Chicken breast, Light alfredo, Broccoli"
            />
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

const TemplateDetailsDialog = ({ template, isOpen, onClose }) => {
  if (!template) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] w-full max-w-[98vw] p-4 sm:p-8 overflow-y-auto overflow-x-auto">
        <DialogHeader>
          <DialogTitle>{template.program_name}</DialogTitle>
          {/* <DialogDescription>
            {template.program_type}
          </DialogDescription> */}
        </DialogHeader>
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Program</h1>
          <p className="text-gray-500">
            Your current wellness program details and recommendations
          </p>
        </div> */}

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Guide</TabsTrigger>
            <TabsTrigger value="supplements">Supplements</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              {/* <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Practice Naturals</span>
                  <Badge className="bg-green-500">Active</Badge>
                </CardTitle>
              </CardHeader> */}
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Program Description
                    </h3>
                    <p className="text-gray-600">
                      {template.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Program Goals</h3>
                    <ul className="space-y-2">
                    {
                      Object.entries(JSON.parse(template.goals))
                        .filter(([_, isEnabled]) => isEnabled)
                        .map(([goal, _], key) => (
                          <li className="flex items-start" key={key}>
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{goal}</span>
                          </li>
                        ))
                    }
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800">
                          Important Reminder
                        </h4>
                        <p className="text-sm text-amber-700">
                          Complete your daily check-in to track your progress
                          and get personalized recommendations from your coach.
                          Consistent check-ins lead to better results!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Food Preparation Rules
                    </h3>
                    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                      <h4 className="font-medium text-amber-800 mb-2">
                        Important Food Prep Guidelines
                      </h4>
                      <ul className="space-y-2">
                      {
                        Object.entries(JSON.parse(template.food_rules))
                          .filter(([_, isEnabled]) => isEnabled)
                          .map(([goal, _], key) => (
                            <li className="flex items-start" key={key}>
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{goal}</span>
                            </li>
                          ))
                      }
                     <h4 className="font-medium text-green-900 mb-2">
                       Allowed Cooking Methods
                      </h4>

                      {
                        Object.entries(JSON.parse(template.cooking_methods))
                          .filter(([_, isEnabled]) => isEnabled)
                          .map(([goal, _], key) => (
                            <li className="flex items-start" key={key}>
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{goal}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Recommended Foods
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-primary-600 mb-2">
                          Proteins
                        </h4>
                        <ul className="space-y-1 text-sm">
                      {
                        template.recommended_proteins?.split(",")
                          .map((value, key) => (
                            <li key = {key}>✓ {value? value:"none"}</li>
                          ))
                        }
                        </ul>
                      </div>
                      

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-primary-600 mb-2">
                          Vegetables
                        </h4>
                        <ul className="space-y-1 text-sm">
                        {
                        template.recommended_vegetables?.split(",")
                          .map((value, key) => (
                            <li key = {key}>✓ {value? value:"none"}</li>
                          ))
                        }
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-primary-600 mb-2">
                          Fruits
                        </h4>
                        <ul className="space-y-1 text-sm">
                        {
                        template.allowed_fruits?.split(",")
                          .map((value, key) => (
                            <li key = {key}>✓ {value? value:"none"}</li>
                          ))
                        }
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-primary-600 mb-2">
                        Healthy Fats 
                        </h4>
                        <ul className="space-y-1 text-sm">
                        {
                        template.healthy_fats?.split(",")
                          .map((value, key) => (
                            <li key = {key}>✓ {value? value:"none"}</li>
                          ))
                        }
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Foods to Avoid</h3>
                    <div className="border rounded-lg p-4 bg-red-50">
                      <ul className="space-y-1">
                        
                      {
                        Object.entries(JSON.parse(template.foods_to_avoid
                        ))
                          .filter(([_, isEnabled]) => isEnabled)
                          .map(([goal, _], key) => (
                            <li className="flex items-start" key={key}>
                             <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{goal}</span>
                            </li>
                          ))
                        }
                  
                      </ul>
                    </div>
                  </div>

                  {template.food_allergies && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Food Allergies</h3>
                      <div className="border rounded-lg p-4 bg-yellow-50">
                        <span className="text-sm text-yellow-900">{template.food_allergies}</span>
                      </div>
                    </div>
                  )}
                  {template.dietary_preferences && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Dietary Preferences</h3>
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <ul className="space-y-1">
                          {Object.entries(JSON.parse(template.dietary_preferences))
                            .filter(([_, isEnabled]) => isEnabled)
                            .map(([pref, _], key) => (
                              <li className="flex items-start" key={key}>
                                <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{pref.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Portion Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {JSON.parse(template?.portion_guidelines || '[]').map((guideline, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-primary-600">Meal {index + 1}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-sm text-gray-500">Protein</p>
                                <p className="font-medium">{guideline.protein || '-'} oz</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Fruit</p>
                                <p className="font-medium">{guideline.fruit || '-'} oz</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Vegetables</p>
                                <p className="font-medium">{guideline.vegetables || '-'} oz</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Carbs</p>
                                <p className="font-medium">{guideline.carbs || '-'} oz</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Fats</p>
                                <p className="font-medium">{guideline.fats || '-'} oz</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Other</p>
                                <p className="font-medium">{guideline.other || '-'} oz</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500">Calories</p>
                                <p className="font-medium">{guideline.calories || '-'} cal</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplements">
            <Card>
              <CardHeader>
                <CardTitle>Supplement Protocol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-600">
                    The following supplements have been recommended for your
                    program. Always take as directed and consult with your
                    healthcare provider before making changes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                  {
                    JSON.parse(template.supplements).map((value,key)=>(
                    
                    <div className="border rounded-lg p-4" key = {key}>
                      <h4 className="font-medium text-primary-600">
                        {value?.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                      {value?.purpose}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Dosage: {value?.dosage}</span>
                        <span className="text-primary-600">
                          {value?.timing}
                        </span>
                      </div>
                    </div>

                    ))
                  }
                   </div>
                      </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Program Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Your program is scheduled to run for {template.program_length} days. Below is an
                    overview of key milestones and check-ins.
                  </p>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Week
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Focus Area
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Coach Check-in
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {
                          JSON.parse(template.weekly_schedule).map((value,key)=>(
                            <tr key = {key}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {value?.week}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value?.focusArea}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value?.coachNotes}
                            </td>
                          </tr>
                          ))
                        }

                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDetailsDialog;

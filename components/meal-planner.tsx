"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";

export function MealPlanner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mealPlan, setMealPlan] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [mealData, setMealData] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const handleMealChange = (meal: string, value: string) => {
    setMealData((prev) => ({ ...prev, [meal]: value }));
  };

  const handleSavePlan = () => {
    if (selectedDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dateString: any = selectedDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMealPlan((prev: any) => ({
        ...prev,
        [dateString]: mealData,
      }));
      setMealData({ breakfast: "", lunch: "", dinner: "" }); // Reset form after saving
      setSelectedDate(null); // Reset the selected date
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const handleDeletePlan = (date: string) => {
    setMealPlan((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedPlans: any = { ...prev };
      delete updatedPlans[date];
      return updatedPlans;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPlanned = (date: any) => {
    return !!mealPlan[date];
  };

  // Function to apply custom styles to the day cell in the calendar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dayClassName = (date: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dateString: any = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD

    return mealPlan[dateString] ? "highlighted-day" : "";
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center text-primary mb-8">
        Weekly Meal Planner
      </h2>

      {/* Calendar for selecting date */}
      <div className="flex justify-center mb-8">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
          dateFormat="yyyy-MM-dd"
          className="p-2 border rounded-md"
          dayClassName={dayClassName} // Apply custom class for planned days
        />
      </div>

      {/* Display form for selected date */}
      {selectedDate && (
        <Card className="shadow-lg rounded-lg border p-4 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-center text-gray-800">
              Fill Meal Plan for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-start space-y-2">
                <Label
                  htmlFor="breakfast"
                  className="font-medium text-gray-700"
                >
                  Breakfast
                </Label>
                <Input
                  id="breakfast"
                  value={mealData.breakfast}
                  onChange={(e) =>
                    handleMealChange("breakfast", e.target.value)
                  }
                  placeholder="Enter breakfast"
                  className="w-full p-3 text-lg rounded-md border border-gray-300"
                />
              </div>

              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="lunch" className="font-medium text-gray-700">
                  Lunch
                </Label>
                <Input
                  id="lunch"
                  value={mealData.lunch}
                  onChange={(e) => handleMealChange("lunch", e.target.value)}
                  placeholder="Enter lunch"
                  className="w-full p-3 text-lg rounded-md border border-gray-300"
                />
              </div>

              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="dinner" className="font-medium text-gray-700">
                  Dinner
                </Label>
                <Input
                  id="dinner"
                  value={mealData.dinner}
                  onChange={(e) => handleMealChange("dinner", e.target.value)}
                  placeholder="Enter dinner"
                  className="w-full p-3 text-lg rounded-md border border-gray-300"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleSavePlan}
                className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
              >
                Save Meal Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display saved meal plans */}
      {Object.keys(mealPlan).length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-center text-primary mb-6">
            Saved Meal Plans
          </h3>
          {Object.keys(mealPlan).map((date) => (
            <Card
              key={date}
              className={`shadow-lg rounded-lg border p-4 mb-6 ${
                isPlanned(date) ? "bg-red-100" : ""
              }`} // Highlight planned days in red
            >
              <CardHeader>
                <CardTitle className="text-xl font-medium text-center text-gray-800">
                  Meal Plan for {new Date(date).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Breakfast:
                    </span>
                    <span className="text-gray-600">
                      {mealPlan[date].breakfast || "Not set"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold text-gray-700">Lunch:</span>
                    <span className="text-gray-600">
                      {mealPlan[date].lunch || "Not set"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-semibold text-gray-700">Dinner:</span>
                    <span className="text-gray-600">
                      {mealPlan[date].dinner || "Not set"}
                    </span>
                  </li>
                </ul>
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={() => handleDeletePlan(date)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

interface AvailabilityData {
  schedule: Record<string, boolean>;
}

interface AvailabilityStepProps {
  data: AvailabilityData;
  onUpdate: (data: AvailabilityData) => void;
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "08:00 - 12:00", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12:00 - 16:00", icon: "☀️" },
  { id: "evening", label: "Evening", time: "16:00 - 18:00", icon: "🌆" },
  { id: "night", label: "Night", time: "18:00 - 21:00", icon: "🌙" },
];

const DAYS = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({ data, onUpdate }) => {
  const [schedule, setSchedule] = useState<Record<string, boolean>>(data.schedule);

  const toggleSlot = (dayId: string, timeSlotId: string) => {
    const key = `${dayId}-${timeSlotId}`;
    const newSchedule = {
      ...schedule,
      [key]: !schedule[key],
    };
    setSchedule(newSchedule);
    onUpdate({ schedule: newSchedule });
  };

  const isSlotSelected = (dayId: string, timeSlotId: string) => {
    const key = `${dayId}-${timeSlotId}`;
    return schedule[key] || false;
  };

  const getSelectedCount = () => {
    return Object.values(schedule).filter(Boolean).length;
  };

  const getDaySelectedCount = (dayId: string) => {
    return TIME_SLOTS.filter(slot => isSlotSelected(dayId, slot.id)).length;
  };

  const getSlotSelectedCount = (timeSlotId: string) => {
    return DAYS.filter(day => isSlotSelected(day.id, timeSlotId)).length;
  };

  const selectCommonPattern = (pattern: string) => {
    let newSchedule = { ...schedule };

    switch (pattern) {
      case "weekdays":
        DAYS.filter(day => !["saturday", "sunday"].includes(day.id)).forEach(day => {
          TIME_SLOTS.filter(slot => ["afternoon", "evening"].includes(slot.id)).forEach(slot => {
            const key = `${day.id}-${slot.id}`;
            newSchedule[key] = true;
          });
        });
        break;
      case "weekends":
        DAYS.filter(day => ["saturday", "sunday"].includes(day.id)).forEach(day => {
          TIME_SLOTS.forEach(slot => {
            const key = `${day.id}-${slot.id}`;
            newSchedule[key] = true;
          });
        });
        break;
      case "mornings":
        DAYS.forEach(day => {
          const key = `${day.id}-morning`;
          newSchedule[key] = true;
        });
        break;
      case "evenings":
        DAYS.forEach(day => {
          const key = `${day.id}-evening`;
          newSchedule[key] = true;
        });
        break;
      case "clear":
        newSchedule = {};
        break;
    }

    setSchedule(newSchedule);
    onUpdate({ schedule: newSchedule });
  };

  const getTotalHours = () => {
    return getSelectedCount() * 4; // Each slot is 4 hours
  };

  return (
    <div className="space-y-6">
      {/* Quick Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Quick Select Patterns</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectCommonPattern("weekdays")}
              className="text-xs"
            >
              Weekdays Afternoon
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectCommonPattern("weekends")}
              className="text-xs"
            >
              All Weekends
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectCommonPattern("mornings")}
              className="text-xs"
            >
              All Mornings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectCommonPattern("evenings")}
              className="text-xs"
            >
              All Evenings
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectCommonPattern("clear")}
            className="mt-2 text-xs text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        </CardContent>
      </Card>

      {/* Availability Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Select Your Available Times</span>
          </CardTitle>
          <p className="text-sm text-slate-400">
            Pod meetings usually happen every 2 weeks and last 1-2 hours
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-slate-700/50 p-2 bg-slate-800/30 text-left text-slate-300">
                      <Users className="w-4 h-4" />
                    </th>
                  {TIME_SLOTS.map((slot) => (
                    <th key={slot.id} className="border border-slate-700/50 p-2 bg-slate-800/30 text-center text-slate-300">
                      <div className="text-xs">
                        <div className="text-lg">{slot.icon}</div>
                        <div className="font-medium">{slot.label}</div>
                        <div className="text-slate-400">{slot.time}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day.id}>
                    <td className="border border-slate-700/50 p-2 bg-slate-800/30 font-medium text-slate-100">
                      <div className="flex items-center justify-between">
                        <span>{day.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {getDaySelectedCount(day.id)}/{TIME_SLOTS.length}
                        </Badge>
                      </div>
                    </td>
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = isSlotSelected(day.id, slot.id);
                      return (
                        <td
                          key={slot.id}
                          className="border border-slate-700/50 p-2 text-center"
                        >
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSlot(day.id, slot.id)}
                            className={`w-full h-12 ${
                              isSelected
                                ? "bg-cyan-600 hover:bg-cyan-700"
                                : "border-slate-700/50 text-slate-300 hover:bg-slate-800/30"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </Button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Column summaries */}
          <div className="mt-4 flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <Badge key={slot.id} variant="outline" className="text-xs">
                {slot.icon} {slot.label}: {getSlotSelectedCount(slot.id)} days
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Availability Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Total Available Slots</Label>
              <p className="text-2xl font-bold text-blue-600">
                {getSelectedCount()} slots
              </p>
              <p className="text-sm text-gray-600">
                {getTotalHours()} hours per week
              </p>
            </div>
            <div>
              <Label>Recommendation</Label>
              <p className="text-sm text-gray-600">
                {getSelectedCount() < 3
                  ? "⚠️ Add more slots to increase matching chances"
                  : getSelectedCount() <= 8
                  ? "✅ Good number of slots for pod matching"
                  : "👍 Very flexible, high matching probability"}
              </p>
            </div>
          </div>

          {/* Selected slots list */}
          {getSelectedCount() > 0 && (
            <div className="mt-4">
                <Label className="text-sm font-medium">Selected Slots:</Label>
              <div className="mt-2 flex flex-wrap gap-1">
                {DAYS.map((day) =>
                  TIME_SLOTS.map((slot) => {
                    const isSelected = isSlotSelected(day.id, slot.id);
                    if (!isSelected) return null;
                    
                    return (
                      <Badge key={`${day.id}-${slot.id}`} variant="secondary" className="text-xs">
                        {day.label} {slot.time}
                      </Badge>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose at least 3-5 different slots for optimal matching</li>
          <li>• Consider your class schedule and other activities</li>
          <li>• Pod meetings usually last 1-2 hours, so allow enough time</li>
          <li>• Higher flexibility increases chances of getting a pod</li>
          <li>• Weekends are generally more popular for pod meetings</li>
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityStep;
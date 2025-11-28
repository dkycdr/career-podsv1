"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Target } from "lucide-react";

interface CareerInterest {
  industry: string;
  role: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  description: string;
}

interface CareerInterestsData {
  interests: CareerInterest[];
}

interface CareerInterestsStepProps {
  data: CareerInterestsData;
  onUpdate: (data: CareerInterestsData) => void;
}

const INDUSTRIES = [
  "Technology/IT",
  "Finance/Banking",
  "Consulting",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Media/Entertainment",
  "Retail/E-commerce",
  "Real Estate",
  "Energy/Oil & Gas",
  "Logistics/Supply Chain",
  "Government/Public Sector",
  "Non-profit/NGO",
  "Startup/Entrepreneurship",
  "Research/Academia",
];

const CAREER_ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "Marketing Manager",
  "Financial Analyst",
  "Consultant",
  "Project Manager",
  "HR Manager",
  "Sales Manager",
  "Operations Manager",
  "Designer",
  "Content Creator",
  "Researcher",
  "Teacher/Educator",
  "Healthcare Professional",
  "Lawyer",
  "Accountant",
  "Engineer",
  "Entrepreneur",
];

const CareerInterestsStep: React.FC<CareerInterestsStepProps> = ({ data, onUpdate }) => {
  const [interests, setInterests] = useState<CareerInterest[]>(data.interests);
  const [newInterest, setNewInterest] = useState<CareerInterest>({
    industry: "",
    role: "",
    priority: "MEDIUM",
    description: "",
  });

  const addInterest = () => {
    if (newInterest.industry && newInterest.role) {
      const updatedInterests = [...interests, { ...newInterest }];
      setInterests(updatedInterests);
      onUpdate({ interests: updatedInterests });
      setNewInterest({
        industry: "",
        role: "",
        priority: "MEDIUM",
        description: "",
      });
    }
  };

  const removeInterest = (index: number) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    setInterests(updatedInterests);
    onUpdate({ interests: updatedInterests });
  };

  const updateInterest = (index: number, field: keyof CareerInterest, value: string) => {
    const updatedInterests = interests.map((interest, i) =>
      i === index ? { ...interest, [field]: value } : interest
    );
    setInterests(updatedInterests);
    onUpdate({ interests: updatedInterests });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Interests */}
      {interests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Your Career Interests</span>
          </h3>
          
          <div className="grid gap-4">
            {interests.map((interest, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Industry</Label>
                          <p className="font-medium">{interest.industry}</p>
                        </div>
                        <div>
                          <Label>Role</Label>
                          <p className="font-medium">{interest.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label>Priority</Label>
                          <Badge className={getPriorityColor(interest.priority)}>
                            {interest.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      {interest.description && (
                        <div>
                          <Label>Description</Label>
                          <p className="text-sm text-gray-600">{interest.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInterest(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Career Interest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={newInterest.industry}
                onValueChange={(value) => setNewInterest({ ...newInterest, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Career Role *</Label>
              <Select
                value={newInterest.role}
                onValueChange={(value) => setNewInterest({ ...newInterest, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select career role" />
                </SelectTrigger>
                <SelectContent>
                  {CAREER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newInterest.priority}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                  setNewInterest({ ...newInterest, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High - Very interested</SelectItem>
                  <SelectItem value="MEDIUM">Medium - Main consideration</SelectItem>
                  <SelectItem value="LOW">Low - Just exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={newInterest.description}
              onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
              placeholder="Explain why you're interested in this field, or what you'd like to learn..."
              rows={3}
            />
          </div>

          <Button
            onClick={addInterest}
            disabled={!newInterest.industry || !newInterest.role}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Career Interest
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add at least one career interest to help AI matching</li>
          <li>• Choose industries and roles that align with your major or passion</li>
          <li>• "High" priority will be weighted more in pod matching</li>
          <li>• A detailed description helps mentors understand your goals</li>
        </ul>
      </div>

      {/* Quick Add Templates */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quick Add - Popular Templates:</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { industry: "Technology/IT", role: "Software Engineer", priority: "HIGH" as const },
            { industry: "Finance/Banking", role: "Financial Analyst", priority: "MEDIUM" as const },
            { industry: "Consulting", role: "Consultant", priority: "HIGH" as const },
            { industry: "Startup/Entrepreneurship", role: "Entrepreneur", priority: "MEDIUM" as const },
          ].map((template, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                const interest = { ...template, description: "" };
                const updatedInterests = [...interests, interest];
                setInterests(updatedInterests);
                onUpdate({ interests: updatedInterests });
              }}
            >
              {template.role}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerInterestsStep;
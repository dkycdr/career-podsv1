"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoData {
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  bio: string;
  password: string;
  confirmPassword: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onUpdate: (data: PersonalInfoData) => void;
}

const PRESIDENT_UNIVERSITY_MAJORS = [
  "Business Administration",
  "Accounting",
  "Management",
  "Computer Science",
  "Information Systems",
  "Information Technology",
  "Mechanical Engineering",
  "Industrial Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Environmental Engineering",
  "International Relations",
  "Communication",
  "Psychology",
  "Law",
  "Primary School Teacher Education",
  "English Language Education",
  "Mathematics Education",
  "Physics Education",
  "Catholic Religious Education",
  "General Medicine",
  "Nursing",
  "Pharmacy",
  "Visual Communication Design",
  "Interior Design",
  "Fashion Design",
];

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<PersonalInfoData>(data);

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">President University Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="name@student.presuniv.ac.id"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="At least 6 characters"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Re-enter your password"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID (NIM) *</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
            placeholder="Example: 202201001"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year of Study *</Label>
          <Select value={formData.year} onValueChange={(value) => handleChange("year", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select year of study" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Year 1 (Freshman)</SelectItem>
              <SelectItem value="2">Year 2 (Sophomore)</SelectItem>
              <SelectItem value="3">Year 3 (Junior)</SelectItem>
              <SelectItem value="4">Year 4 (Senior)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="major">Major *</Label>
          <Select value={formData.major} onValueChange={(value) => handleChange("major", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your major" />
            </SelectTrigger>
            <SelectContent>
              {PRESIDENT_UNIVERSITY_MAJORS.map((major) => (
                <SelectItem key={major} value={major}>
                  {major}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Short Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell us a bit about yourself, your interests, and what you expect from Career Explorer Pods..."
            rows={4}
            className="w-full"
          />
          <p className="text-sm text-gray-500">
            {formData.bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use a valid President University email for verification</li>
          <li>• Choose a secure password (at least 6 characters)</li>
          <li>• Make sure your Student ID (NIM) is correct for academic identification</li>
          <li>• A clear bio helps the AI matching find the right pod for you</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
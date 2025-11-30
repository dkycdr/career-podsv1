"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, User, Target, Award, Calendar, Check } from "lucide-react";

import PersonalInfoStep from "./PersonalInfoStep";
import CareerInterestsStep from "./CareerInterestsStep";
import SkillsGoalsStep from "./SkillsGoalsStep";
import AvailabilityStep from "./AvailabilityStep";
import ReviewStep from "./ReviewStep";

interface OnboardingData {
  personalInfo: {
    name: string;
    email: string;
    studentId: string;
    major: string;
    year: string;
    bio: string;
    password: string;
    confirmPassword: string;
  };
  careerInterests: {
    interests: Array<{
      industry: string;
      role: string;
      priority: "LOW" | "MEDIUM" | "HIGH";
      description: string;
    }>;
  };
  skills: {
    currentSkills: Array<{
      skillId: string;
      level: number;
    }>;
    targetSkills: Array<{
      skillId: string;
      targetLevel: number;
    }>;
  };
  availability: {
    schedule: Record<string, boolean>;
  };
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      name: "",
      email: "",
      studentId: "",
      major: "",
      year: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
    careerInterests: {
      interests: [],
    },
    skills: {
      currentSkills: [],
      targetSkills: [],
    },
    availability: {
      schedule: {},
    },
  });

  const steps = [
    {
      id: "personal",
      title: "Personal Info",
      description: "Basic student information for President University",
      icon: User,
    },
    {
      id: "career",
      title: "Career Interests",
      description: "Areas of career interest you'd like to explore",
      icon: Target,
    },
    {
      id: "skills",
      title: "Skills & Goals",
      description: "Skills you have and want to develop",
      icon: Award,
    },
    {
      id: "availability",
      title: "Availability",
      description: "Times you're available for pod meetings",
      icon: Calendar,
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your data before submission",
      icon: Check,
    },
  ];

  const updateData = (step: string, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [step]: data,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      });

      if (response.ok) {
        const data = await response.json();
        // Save userId to localStorage
        localStorage.setItem('userId', data.user.id);
        // Redirect to success page with userId
        window.location.href = `/success?userId=${data.user.id}`;
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData.error);
        alert(`Registration failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            data={onboardingData.personalInfo}
            onUpdate={(data) => updateData("personalInfo", data)}
          />
        );
      case 1:
        return (
          <CareerInterestsStep
            data={onboardingData.careerInterests}
            onUpdate={(data) => updateData("careerInterests", data)}
          />
        );
      case 2:
        return (
          <SkillsGoalsStep
            data={onboardingData.skills}
            onUpdate={(data) => updateData("skills", data)}
          />
        );
      case 3:
        return (
          <AvailabilityStep
            data={onboardingData.availability}
            onUpdate={(data) => updateData("availability", data)}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={onboardingData}
            onUpdate={(data) => setOnboardingData(data)}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          onboardingData.personalInfo.name &&
          onboardingData.personalInfo.email &&
          onboardingData.personalInfo.studentId &&
          onboardingData.personalInfo.major &&
          onboardingData.personalInfo.year &&
          onboardingData.personalInfo.password &&
          onboardingData.personalInfo.password.length >= 6 &&
          onboardingData.personalInfo.password === onboardingData.personalInfo.confirmPassword
        );
      case 1:
        return onboardingData.careerInterests.interests.length > 0;
      case 2:
        return (
          onboardingData.skills.currentSkills.length > 0 ||
          onboardingData.skills.targetSkills.length > 0
        );
      case 3:
        return Object.values(onboardingData.availability.schedule).some(Boolean);
      case 4:
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 gradient-brand rounded-lg flex items-center justify-center glow-sm">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100">
              Career Explorer Pods - Onboarding
            </h1>
          </div>
          <p className="text-slate-400">
            Join the President University career exploration community
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-cyan-600 text-white"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-cyan-400" : isCompleted ? "text-green-400" : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        isCompleted ? "bg-green-600" : "bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
          <p className="text-center text-sm text-slate-400 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Form Content */}
        <Card className="glass-alt card-border border-slate-700/50 bg-slate-900/40">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="w-4 h-4 text-cyan-400" />;
                })()}
              </div>
              <div>
                <CardTitle className="text-slate-100">{steps[currentStep].title}</CardTitle>
                <CardDescription className="text-slate-400">{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Complete Registration</span>
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
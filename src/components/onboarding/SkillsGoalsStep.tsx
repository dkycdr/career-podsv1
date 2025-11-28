"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Award, TrendingUp } from "lucide-react";

interface UserSkill {
  skillId: string;
  level: number;
}

interface TargetSkill {
  skillId: string;
  targetLevel: number;
}

interface SkillsData {
  currentSkills: UserSkill[];
  targetSkills: TargetSkill[];
}

interface SkillsGoalsStepProps {
  data: SkillsData;
  onUpdate: (data: SkillsData) => void;
}

const SKILLS = [
  // Technical Skills
  { id: "programming", name: "Programming", category: "Technical" },
  { id: "data-analysis", name: "Data Analysis", category: "Technical" },
  { id: "web-development", name: "Web Development", category: "Technical" },
  { id: "mobile-development", name: "Mobile Development", category: "Technical" },
  { id: "machine-learning", name: "Machine Learning", category: "Technical" },
  { id: "cloud-computing", name: "Cloud Computing", category: "Technical" },
  { id: "cybersecurity", name: "Cybersecurity", category: "Technical" },
  { id: "database-management", name: "Database Management", category: "Technical" },
  { id: "ui-ux-design", name: "UI/UX Design", category: "Technical" },
  { id: "digital-marketing", name: "Digital Marketing", category: "Technical" },
  
  // Business Skills
  { id: "project-management", name: "Project Management", category: "Business" },
  { id: "business-analysis", name: "Business Analysis", category: "Business" },
  { id: "financial-planning", name: "Financial Planning", category: "Business" },
  { id: "strategic-planning", name: "Strategic Planning", category: "Business" },
  { id: "business-development", name: "Business Development", category: "Business" },
  { id: "sales-negotiation", name: "Sales & Negotiation", category: "Business" },
  { id: "market-research", name: "Market Research", category: "Business" },
  { id: "risk-management", name: "Risk Management", category: "Business" },
  
  // Soft Skills
  { id: "communication", name: "Communication", category: "Soft Skills" },
  { id: "leadership", name: "Leadership", category: "Soft Skills" },
  { id: "teamwork", name: "Teamwork", category: "Soft Skills" },
  { id: "problem-solving", name: "Problem Solving", category: "Soft Skills" },
  { id: "critical-thinking", name: "Critical Thinking", category: "Soft Skills" },
  { id: "time-management", name: "Time Management", category: "Soft Skills" },
  { id: "public-speaking", name: "Public Speaking", category: "Soft Skills" },
  { id: "creativity", name: "Creativity", category: "Soft Skills" },
  { id: "adaptability", name: "Adaptability", category: "Soft Skills" },
  { id: "emotional-intelligence", name: "Emotional Intelligence", category: "Soft Skills" },
  
  // Languages
  { id: "english", name: "English", category: "Languages" },
  { id: "mandarin", name: "Mandarin", category: "Languages" },
  { id: "japanese", name: "Japanese", category: "Languages" },
  { id: "korean", name: "Korean", category: "Languages" },
  { id: "german", name: "German", category: "Languages" },
  { id: "french", name: "French", category: "Languages" },
];

const SkillsGoalsStep: React.FC<SkillsGoalsStepProps> = ({ data, onUpdate }) => {
  const [currentSkills, setCurrentSkills] = useState<UserSkill[]>(data.currentSkills);
  const [targetSkills, setTargetSkills] = useState<TargetSkill[]>(data.targetSkills);

  const addCurrentSkill = (skillId: string, level: number) => {
    const exists = currentSkills.some(skill => skill.skillId === skillId);
    if (!exists) {
      const updatedSkills = [...currentSkills, { skillId, level }];
      setCurrentSkills(updatedSkills);
      onUpdate({ currentSkills: updatedSkills, targetSkills });
    }
  };

  const removeCurrentSkill = (skillId: string) => {
    const updatedSkills = currentSkills.filter(skill => skill.skillId !== skillId);
    setCurrentSkills(updatedSkills);
    onUpdate({ currentSkills: updatedSkills, targetSkills });
  };

  const updateCurrentSkillLevel = (skillId: string, level: number) => {
    const updatedSkills = currentSkills.map(skill =>
      skill.skillId === skillId ? { ...skill, level } : skill
    );
    setCurrentSkills(updatedSkills);
    onUpdate({ currentSkills: updatedSkills, targetSkills });
  };

  const addTargetSkill = (skillId: string, targetLevel: number) => {
    const exists = targetSkills.some(skill => skill.skillId === skillId);
    if (!exists) {
      const updatedSkills = [...targetSkills, { skillId, targetLevel }];
      setTargetSkills(updatedSkills);
      onUpdate({ currentSkills, targetSkills: updatedSkills });
    }
  };

  const removeTargetSkill = (skillId: string) => {
    const updatedSkills = targetSkills.filter(skill => skill.skillId !== skillId);
    setTargetSkills(updatedSkills);
    onUpdate({ currentSkills, targetSkills: updatedSkills });
  };

  const updateTargetSkillLevel = (skillId: string, targetLevel: number) => {
    const updatedSkills = targetSkills.map(skill =>
      skill.skillId === skillId ? { ...skill, targetLevel } : skill
    );
    setTargetSkills(updatedSkills);
    onUpdate({ currentSkills, targetSkills: updatedSkills });
  };

  const getSkillName = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    return skill?.name || skillId;
  };

  const getSkillCategory = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    return skill?.category || "";
  };

  const getLevelColor = (level: number) => {
    if (level <= 2) return "bg-red-100 text-red-800";
    if (level <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getLevelText = (level: number) => {
    if (level === 1) return "Beginner";
    if (level === 2) return "Elementary";
    if (level === 3) return "Intermediate";
    if (level === 4) return "Advanced";
    if (level === 5) return "Expert";
    return "Unknown";
  };

  const availableSkills = SKILLS.filter(skill => 
    !currentSkills.some(cs => cs.skillId === skill.id)
  );

  const availableTargetSkills = SKILLS.filter(skill => 
    !targetSkills.some(ts => ts.skillId === skill.id)
  );

  return (
    <div className="space-y-6">
      {/* Current Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Skills Saat Ini</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSkills.length > 0 ? (
            <div className="grid gap-3">
              {currentSkills.map((skill) => (
                <div key={skill.skillId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{getSkillName(skill.skillId)}</p>
                      <p className="text-sm text-gray-500">{getSkillCategory(skill.skillId)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select
                      value={skill.level.toString()}
                      onValueChange={(value) => updateCurrentSkillLevel(skill.skillId, parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {getLevelText(level)} ({level}/5)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Badge className={getLevelColor(skill.level)}>
                      {getLevelText(skill.level)}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCurrentSkill(skill.skillId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No skills added yet
            </p>
          )}

          {/* Add Current Skill */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Add Current Skill:</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <Select onValueChange={(skillId) => addCurrentSkill(skillId, 1)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Target Skills to Develop</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {targetSkills.length > 0 ? (
            <div className="grid gap-3">
              {targetSkills.map((skill) => (
                <div key={skill.skillId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{getSkillName(skill.skillId)}</p>
                      <p className="text-sm text-gray-500">{getSkillCategory(skill.skillId)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select
                      value={skill.targetLevel.toString()}
                      onValueChange={(value) => updateTargetSkillLevel(skill.skillId, parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {getLevelText(level)} ({level}/5)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Badge className={getLevelColor(skill.targetLevel)}>
                      Target: {getLevelText(skill.targetLevel)}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTargetSkill(skill.skillId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No target skills added yet
            </p>
          )}

          {/* Add Target Skill */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Add Target Skill:</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <Select onValueChange={(skillId) => addTargetSkill(skillId, 3)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose target skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableTargetSkills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Templates */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quick Add - Popular Skills:</Label>
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Technical Skills:</p>
          <div className="flex flex-wrap gap-2">
            {["programming", "data-analysis", "web-development", "communication", "leadership"].map((skillId) => (
              <Button
                key={skillId}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!currentSkills.some(cs => cs.skillId === skillId)) {
                    addCurrentSkill(skillId, 1);
                  }
                  if (!targetSkills.some(ts => ts.skillId === skillId)) {
                    addTargetSkill(skillId, 3);
                  }
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                {getSkillName(skillId)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be honest in assessing your current skill level</li>
          <li>• Set realistic skill targets that match your career interests</li>
          <li>• Focus on skills relevant to your target industry</li>
          <li>• Soft skills are equally important as technical skills</li>
          <li>• Foreign language proficiency can be a significant advantage</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsGoalsStep;
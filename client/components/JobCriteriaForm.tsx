"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { JobCriteria } from "@/types/resume";
import { X } from "lucide-react";

interface JobCriteriaFormProps {
  onSubmit: (criteria: JobCriteria) => void;
}

export function JobCriteriaForm({ onSubmit }: JobCriteriaFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);

  const handleAddSkill = (type: "required" | "preferred") => {
    if (!skillInput.trim()) return;

    if (type === "required") {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
    } else {
      setPreferredSkills([...preferredSkills, skillInput.trim()]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string, type: "required" | "preferred") => {
    if (type === "required") {
      setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    } else {
      setPreferredSkills(preferredSkills.filter((s) => s !== skill));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      requiredSkills,
      preferredSkills,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Criteria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the job description..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a required skill"
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill("required")}
                  disabled={!skillInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {requiredSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-primary text-primary-foreground rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, "required")}
                      className="p-1 hover:bg-primary-foreground/20 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a preferred skill"
                />
                <Button
                  type="button"
                  onClick={() => handleAddSkill("preferred")}
                  disabled={!skillInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferredSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill, "preferred")}
                      className="p-1 hover:bg-secondary-foreground/20 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!title || !description || requiredSkills.length === 0}
          >
            Set Job Criteria
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

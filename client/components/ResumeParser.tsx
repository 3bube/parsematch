"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "@/components/ResumeUploader";
import { JobCriteriaForm } from "@/components/JobCriteriaForm";
import { ResumeMatches } from "@/components/ResumeMatches";
import type { JobCriteria, ResumeMatch, ResumeData } from "@/types/resume";

export function ResumeParser() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [jobCriteria, setJobCriteria] = useState<JobCriteria | null>(null);
  const [matches, setMatches] = useState<ResumeMatch[]>([]);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFilesUpload = async (files: File[]) => {
    setIsUploading(true);

    try {
      // Validate files
      const validFiles = files.filter((file) => {
        const validTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return validTypes.includes(file.type);
      });

      if (validFiles.length === 0) {
        throw new Error("Please upload PDF or DOCX files only");
      }

      setUploadedFiles((prev) => [...prev, ...validFiles.map((f) => f.name)]);

      // Simulate parsing multiple resumes
      // In a real app, you would send the files to your backend API
      await Promise.all(
        validFiles.map(async (file) => {
          console.log(file);
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock data for demonstration
          const mockData: ResumeData = {
            personalInfo: {
              name: `Candidate ${Math.floor(Math.random() * 100)}`,
              email: `candidate${Math.floor(Math.random() * 100)}@example.com`,
              phone: "(555) 123-4567",
            },
            summary:
              "Experienced professional with a track record of success...",
            experience: [
              {
                title: "Senior Developer",
                company: "Tech Corp",
                location: "Remote",
                startDate: "2020",
                endDate: "Present",
                description: "Led development of key projects...",
              },
            ],
            skills: [
              "JavaScript",
              "Python",
              "React",
              "Node.js",
              "AWS",
              "Docker",
              "Kubernetes",
              "Git",
            ]
              .sort(() => Math.random() - 0.5)
              .slice(0, 5), // Randomly select 5 skills
          };

          return mockData;
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleJobCriteriaSubmit = (criteria: JobCriteria) => {
    setJobCriteria(criteria);

    // Simulate matching process
    // In a real app, this would be done by your backend
    const mockMatches: ResumeMatch[] = uploadedFiles.map((fileName) => {
      const mockSkills = [
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "AWS",
        "Docker",
        "Kubernetes",
        "Git",
      ]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5); // Randomly select 5 skills

      const matchedSkills = mockSkills.filter(
        (skill) =>
          criteria.requiredSkills.includes(skill) ||
          criteria.preferredSkills.includes(skill)
      );

      const missingSkills = criteria.requiredSkills.filter(
        (skill) => !mockSkills.includes(skill)
      );

      const matchScore = Math.round(
        ((matchedSkills.length * 2) /
          (criteria.requiredSkills.length * 2 +
            criteria.preferredSkills.length)) *
          100
      );

      return {
        fileName,
        personalInfo: {
          name: `Candidate ${Math.floor(Math.random() * 100)}`,
          email: `candidate${Math.floor(Math.random() * 100)}@example.com`,
          phone: "(555) 123-4567",
        },
        summary: "Experienced professional with a track record of success...",
        experience: [
          {
            title: "Senior Developer",
            company: "Tech Corp",
            location: "Remote",
            startDate: "2020",
            endDate: "Present",
            description: "Led development of key projects...",
          },
        ],
        skills: mockSkills,
        matchScore,
        skillMatches: {
          matched: matchedSkills,
          missing: missingSkills,
        },
      };
    });

    setMatches(mockMatches);
    setActiveTab("matches");
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setJobCriteria(null);
    setMatches([]);
    setActiveTab("upload");
  };

  return (
    <Card className="p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Resumes</TabsTrigger>
          <TabsTrigger
            value="matches"
            disabled={!jobCriteria || uploadedFiles.length === 0}
          >
            View Matches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ResumeUploader
              onFilesUpload={handleFilesUpload}
              isUploading={isUploading}
              uploadedFiles={uploadedFiles}
            />
            <JobCriteriaForm onSubmit={handleJobCriteriaSubmit} />
          </div>
        </TabsContent>

        <TabsContent value="matches">
          {matches.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{jobCriteria?.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {matches.length} resumes analyzed
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
              </div>
              <ResumeMatches matches={matches} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

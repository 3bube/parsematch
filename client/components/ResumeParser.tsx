"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "@/components/ResumeUploader";
import { JobCriteriaForm } from "@/components/JobCriteriaForm";
import { ResumeMatches } from "@/components/ResumeMatches";
import type { JobCriteria, ResumeMatch, ResumeData } from "@/types/resume";
import { parseResume, fetchGithub, GitHubData } from "@/api/resume";
import { Input } from "@/components/ui/input";

export function ResumeParser() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [jobCriteria, setJobCriteria] = useState<JobCriteria | null>(null);
  const [matches, setMatches] = useState<ResumeMatch[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [processedResumes, setProcessedResumes] = useState<ResumeData[]>([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [githubData, setGithubData] = useState<GitHubData | null>(null);

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

      // Process each file using the parseResume API
      const resumeDataPromises = validFiles.map(async (file) => {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", file.name);

        // Call the API
        try {
          const resumeData = await parseResume({
            file: formData,
            filename: file.name,
          });
          return resumeData;
        } catch (error) {
          console.error(`Error parsing resume ${file.name}:`, error);
          // Return a placeholder for failed parsing
          return {
            personalInfo: {
              name: `Failed to parse ${file.name}`,
              email: "N/A",
              phone: "N/A",
            },
            summary: "Failed to parse this resume.",
            experience: [],
            skills: [],
          };
        }
      });

      // Wait for all resumes to be processed
      const processedResumes = await Promise.all(resumeDataPromises);
      console.log("Processed resumes:", processedResumes);

      // Store the processed resume data for later matching
      setProcessedResumes(processedResumes);
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
    const mockMatches: ResumeMatch[] = processedResumes.map((resume) => {
      const mockSkills = resume.skills || [];

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
        fileName: resume.personalInfo.name,
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        experience: resume.experience,
        skills: resume.skills,
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

  const handleFetchGithub = async () => {
    if (!githubUsername.trim()) return;

    setIsLoadingGithub(true);
    try {
      const data = await fetchGithub(githubUsername.trim());
      setGithubData(data);
      console.log("GitHub data:", data);
      // You could enhance the resume data with GitHub information here
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error);
    } finally {
      setIsLoadingGithub(false);
    }
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setJobCriteria(null);
    setMatches([]);
    setProcessedResumes([]);
    setGithubUsername("");
    setGithubData(null);
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
            <div className="space-y-6">
              <JobCriteriaForm onSubmit={handleJobCriteriaSubmit} />

              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">GitHub Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Enhance resume analysis with GitHub data
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="GitHub username"
                    />
                    <Button
                      type="button"
                      onClick={handleFetchGithub}
                      disabled={isLoadingGithub || !githubUsername.trim()}
                    >
                      {isLoadingGithub ? "Loading..." : "Fetch"}
                    </Button>
                  </div>
                  {githubData && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">
                        GitHub data fetched successfully!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Data will be used to enhance resume analysis.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
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

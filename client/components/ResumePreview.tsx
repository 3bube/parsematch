import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Calendar,
} from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{personalInfo.name}</h2>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Experience</h3>
          {experience.map((job, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <div className="text-sm font-medium">{job.company}</div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {job.startDate} - {job.endDate}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {job.location && (
                  <div className="flex items-center mb-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{job.location}</span>
                  </div>
                )}
                <p className="text-sm">{job.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Education</h3>
          {education.map((edu, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{edu.degree}</CardTitle>
                    <div className="text-sm font-medium">{edu.institution}</div>
                  </div>
                  {edu.graduationDate && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      <span>{edu.graduationDate}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {edu.location && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{edu.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

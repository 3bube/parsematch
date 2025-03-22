import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import type { ResumeMatch } from "@/types/resume";
import { ResumePreview } from "./ResumePreview";

interface ResumeMatchesProps {
  matches: ResumeMatch[];
}

export function ResumeMatches({ matches }: ResumeMatchesProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  // Sort matches by score in descending order
  const sortedMatches = [...matches].sort(
    (a, b) => b.matchScore - a.matchScore
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resume Matches</h2>
      {sortedMatches.map((match) => (
        <Card key={match.fileName}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {match.fileName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={match.matchScore} className="w-[100px]" />
                  <span className="text-sm font-medium">
                    {match.matchScore}% Match
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setExpandedMatch(
                    expandedMatch === match.fileName ? null : match.fileName
                  )
                }
              >
                {expandedMatch === match.fileName ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Skills Match</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Matched Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {match.skillMatches.matched.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Missing Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {match.skillMatches.missing.map((skill) => (
                        <Badge
                          key={skill}
                          variant="destructive"
                          className="bg-red-100 text-red-800 hover:bg-red-100"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {expandedMatch === match.fileName && (
                <div className="pt-4 border-t">
                  <ResumePreview resumeData={match} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { ResumeData } from "@/types/resume";
import newRequest from "./newRequest";

interface ResumeUploadData {
  file: FormData;
  filename: string;
}

export interface GitHubData {
  username: string;
  name?: string;
  bio?: string;
  repos?: {
    name: string;
    description?: string;
    language?: string;
    stars: number;
    forks: number;
    url: string;
  }[];
  contributions?: number;
  languages?: Record<string, number>;
  // Add more fields as needed based on your server's response
}

export const parseResume = async (resumeData: ResumeUploadData): Promise<ResumeData> => {
  try {
    const { data } = await newRequest.post("/parse-resume", resumeData.file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to parse resume");
  }
};

export const fetchGithub = async (username: string): Promise<GitHubData> => {
  try {
    const { data } = await newRequest.get(`/fetch_github_data/${username}`);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch GitHub data");
  }
};

export const rankCandidates = async (resumeData: ResumeData) => {
  try {
    const { data } = await newRequest.post("/rank-candidates", resumeData);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to rank candidates");
  }
};

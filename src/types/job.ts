export type Job = {
  id: number;
  title: string;
  category: string;
  source: string;

  sourceUrl: string | null;
  deadline: string | null;

  score: number;

  budget: string;
  budgetMin: number;
  budgetMax: number;

  estimatedTime: string;
  estimatedHoursMin: number;
  estimatedHoursMax: number;

  hourlyRate: string;
  workType: string;

  tags: string[];

  summary: string;
  reasons: string[];
  risks: string[];
};
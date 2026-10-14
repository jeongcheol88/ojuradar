export type CollectedJob = {
  source: string;
  externalId: string;

  sourceUrl?: string | null;

  title: string;
  category: string;

  budgetMin: number;
  budgetMax: number;

  workType: string;

  estimatedHoursMin: number;
  estimatedHoursMax: number;

  tags: string[];

  summary: string;

  deadline?: Date | null;
  publishedAt?: Date | null;
};
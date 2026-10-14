import type { Job } from "@/types/job";

type DatabaseJob = {
  id: number;

  source: string;
  sourceUrl: string | null;

  title: string;
  category: string;

  budgetMin: number;
  budgetMax: number;

  workType: string;

  estimatedHoursMin: number;
  estimatedHoursMax: number;

  tags: string[];

  summary: string;

  deadline: Date | null;
};

export function mapDatabaseJobToJob(
  dbJob: DatabaseJob
): Job {
  const budget =
    dbJob.budgetMin === dbJob.budgetMax
      ? `${dbJob.budgetMax.toLocaleString("ko-KR")}원`
      : `${dbJob.budgetMin.toLocaleString(
          "ko-KR"
        )}~${dbJob.budgetMax.toLocaleString(
          "ko-KR"
        )}원`;

  const hasEstimatedHours =
    dbJob.estimatedHoursMin > 0 &&
    dbJob.estimatedHoursMax > 0;

  const estimatedTime = hasEstimatedHours
    ? dbJob.estimatedHoursMin ===
      dbJob.estimatedHoursMax
      ? `${dbJob.estimatedHoursMax}시간`
      : `${dbJob.estimatedHoursMin}~${dbJob.estimatedHoursMax}시간`
    : "미정";

  const hourlyMin = hasEstimatedHours
    ? Math.floor(
        dbJob.budgetMin /
          dbJob.estimatedHoursMax /
          10000
      )
    : 0;

  const hourlyMax = hasEstimatedHours
    ? Math.floor(
        dbJob.budgetMax /
          dbJob.estimatedHoursMin /
          10000
      )
    : 0;

  const hourlyRate = hasEstimatedHours
    ? hourlyMin === hourlyMax
      ? `${hourlyMax}만원`
      : `${hourlyMin}~${hourlyMax}만원`
    : "산정 전";

  return {
    id: dbJob.id,

    title: dbJob.title,
    category: dbJob.category,
    source: dbJob.source,
    sourceUrl: dbJob.sourceUrl,

    deadline: dbJob.deadline
      ? dbJob.deadline.toISOString()
      : null,
      
    score: 70,

    budget,
    budgetMin: dbJob.budgetMin,
    budgetMax: dbJob.budgetMax,

    estimatedTime,
    estimatedHoursMin:
      dbJob.estimatedHoursMin,
    estimatedHoursMax:
      dbJob.estimatedHoursMax,

    hourlyRate,

    workType: dbJob.workType,

    tags: dbJob.tags,

    summary: dbJob.summary,

    reasons: [],
    risks: [],
  };
}
import type { Job } from "@/types/job";

type DatabaseJob = {
  id: number;

  source: string;

  title: string;
  category: string;

  budgetMin: number;
  budgetMax: number;

  workType: string;

  estimatedHoursMin: number;
  estimatedHoursMax: number;

  tags: string[];

  summary: string;
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

  const estimatedTime =
    dbJob.estimatedHoursMin ===
    dbJob.estimatedHoursMax
      ? `${dbJob.estimatedHoursMax}시간`
      : `${dbJob.estimatedHoursMin}~${dbJob.estimatedHoursMax}시간`;

  const hourlyMin =
    dbJob.estimatedHoursMax > 0
      ? Math.floor(
          dbJob.budgetMin /
            dbJob.estimatedHoursMax /
            10000
        )
      : 0;

  const hourlyMax =
    dbJob.estimatedHoursMin > 0
      ? Math.floor(
          dbJob.budgetMax /
            dbJob.estimatedHoursMin /
            10000
        )
      : 0;

  const hourlyRate =
    hourlyMin === hourlyMax
      ? `${hourlyMax}만원`
      : `${hourlyMin}~${hourlyMax}만원`;

  return {
    id: dbJob.id,

    title: dbJob.title,
    category: dbJob.category,
    source: dbJob.source,

    // 레이더 저장 전 사용할 임시 기본점수
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
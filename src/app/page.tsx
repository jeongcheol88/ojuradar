export const instant = false;

import HomeClient from "./HomeClient";

import { prisma } from "@/lib/prisma";
import { mapDatabaseJobToJob } from "@/lib/jobMapper";
import type { Job } from "@/types/job";

function normalizeDuplicateKey(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function removeDuplicateJobs(
  jobs: Job[]
) {
  const seen =
    new Set<string>();

  return jobs.filter((job) => {
    /*
     * 같은 출처 + 같은 제목 + 같은 요약이면
     * 같은 공고의 차수/수정공고로 판단.
     *
     * DB 조회가 최신순이므로
     * 가장 최신 1건만 남는다.
     */
    const key = [
      job.source,
      normalizeDuplicateKey(
        job.title
      ),
      normalizeDuplicateKey(
        job.summary
      ),
    ].join("::");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

export default async function Home() {
  const dbJobs =
    await prisma.job.findMany({
      where: {
        isActive: true,

        source: {
          not: "샘플 플랫폼",
        },
      },

      /*
       * 중복일 경우 가장 최신 공고를
       * 남기기 위해 최신순 조회
       */
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  const mappedJobs =
    dbJobs.map(
      mapDatabaseJobToJob
    );

  const jobs =
    removeDuplicateJobs(
      mappedJobs
    );

  return (
    <HomeClient jobs={jobs} />
  );
}
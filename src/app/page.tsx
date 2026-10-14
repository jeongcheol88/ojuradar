export const instant = false;

import HomeClient from "./HomeClient";

import { prisma } from "@/lib/prisma";
import { mapDatabaseJobToJob } from "@/lib/jobMapper";

export default async function Home() {
  const dbJobs = await prisma.job.findMany({
    where: {
      isActive: true,

      // 개발용 샘플은 홈에서 숨김
      source: {
        not: "샘플 플랫폼",
      },
    },

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const jobs = dbJobs.map(
    mapDatabaseJobToJob
  );

  return <HomeClient jobs={jobs} />;
}
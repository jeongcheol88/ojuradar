import HomeClient from "./HomeClient";

import { prisma } from "@/lib/prisma";
import { mapDatabaseJobToJob } from "@/lib/jobMapper";

export default async function Home() {
  const dbJobs = await prisma.job.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const jobs = dbJobs.map(
    mapDatabaseJobToJob
  );

  return <HomeClient jobs={jobs} />;
}
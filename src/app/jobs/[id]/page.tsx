export const instant = false;

import { notFound } from "next/navigation";

import JobDetailClient from "./JobDetailClient";

import { prisma } from "@/lib/prisma";
import { mapDatabaseJobToJob } from "@/lib/jobMapper";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  const { id } = await params;

  const jobId = Number(id);

  if (!Number.isInteger(jobId)) {
    notFound();
  }

  const dbJob = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!dbJob || !dbJob.isActive) {
    notFound();
  }

  const job = mapDatabaseJobToJob(dbJob);

  return <JobDetailClient job={job} />;
}
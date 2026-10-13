import { notFound } from "next/navigation";

import { jobs } from "@/data/jobs";

import JobDetailClient from "./JobDetailClient";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return jobs.map((job) => ({
    id: String(job.id),
  }));
}

export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  const { id } = await params;

  const job = jobs.find(
    (item) => item.id === Number(id)
  );

  if (!job) {
    notFound();
  }

  return <JobDetailClient job={job} />;
}
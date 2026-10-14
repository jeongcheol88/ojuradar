import { prisma } from "@/lib/prisma";

import type { CollectedJob } from "./types";

export type SaveCollectedJobsResult = {
  total: number;
  created: number;
  updated: number;
};

export async function saveCollectedJobs(
  jobs: CollectedJob[]
): Promise<SaveCollectedJobsResult> {
  let created = 0;
  let updated = 0;

  for (const job of jobs) {
    const existingJob =
      await prisma.job.findUnique({
        where: {
          source_externalId: {
            source: job.source,
            externalId: job.externalId,
          },
        },
      });

    await prisma.job.upsert({
      where: {
        source_externalId: {
          source: job.source,
          externalId: job.externalId,
        },
      },

      create: {
        source: job.source,
        externalId: job.externalId,
        sourceUrl: job.sourceUrl ?? null,

        title: job.title,
        category: job.category,

        budgetMin: job.budgetMin,
        budgetMax: job.budgetMax,

        workType: job.workType,

        estimatedHoursMin:
          job.estimatedHoursMin,

        estimatedHoursMax:
          job.estimatedHoursMax,

        tags: job.tags,

        summary: job.summary,

        deadline: job.deadline ?? null,

        publishedAt:
          job.publishedAt ?? null,

        isActive: true,
      },

      update: {
        sourceUrl: job.sourceUrl ?? null,

        title: job.title,
        category: job.category,

        budgetMin: job.budgetMin,
        budgetMax: job.budgetMax,

        workType: job.workType,

        estimatedHoursMin:
          job.estimatedHoursMin,

        estimatedHoursMax:
          job.estimatedHoursMax,

        tags: job.tags,

        summary: job.summary,

        deadline: job.deadline ?? null,

        publishedAt:
          job.publishedAt ?? null,

        isActive: true,
      },
    });

    if (existingJob) {
      updated++;
    } else {
      created++;
    }
  }

  return {
    total: jobs.length,
    created,
    updated,
  };
}
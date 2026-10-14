import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

import { collectG2bJobs } from "../src/lib/collectors/g2bCollector";
import { mapG2bJob } from "../src/lib/collectors/g2bMapper";

const connectionString =
  process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error(
    "DIRECT_URL이 설정되어 있지 않습니다."
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log(
    "📡 나라장터 실데이터 수집 시작"
  );

  // 최근 3일 / 최대 100건
  const rawJobs =
    await collectG2bJobs(3, 1, 100);

  console.log(
    `📥 나라장터 원본 ${rawJobs.length}건`
  );

  const jobs = rawJobs
    .map(mapG2bJob)
    .filter(
      (job): job is NonNullable<typeof job> =>
        job !== null
    );

  console.log(
    `🎯 외주레이더 관련 공고 ${jobs.length}건`
  );

  let created = 0;
  let updated = 0;

  for (const job of jobs) {
    const existing =
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
        sourceUrl:
          job.sourceUrl ?? null,

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

        deadline:
          job.deadline ?? null,

        publishedAt:
          job.publishedAt ?? null,

        isActive: true,
      },

      update: {
        sourceUrl:
          job.sourceUrl ?? null,

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

        deadline:
          job.deadline ?? null,

        publishedAt:
          job.publishedAt ?? null,

        isActive: true,
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.log("");
  console.log("✅ 나라장터 저장 완료");
  console.log(`신규: ${created}건`);
  console.log(`갱신: ${updated}건`);
}

main()
  .catch((error) => {
    console.error(
      "❌ 나라장터 저장 실패"
    );

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
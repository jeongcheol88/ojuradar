import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

import { collectDemoJobs } from "../src/lib/collectors/demoCollector";

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
  const collectedJobs =
    await collectDemoJobs();

  let created = 0;
  let updated = 0;

  for (const job of collectedJobs) {
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
        ...job,
        sourceUrl:
          job.sourceUrl ?? null,
        deadline:
          job.deadline ?? null,
        publishedAt:
          job.publishedAt ?? null,

        isActive: true,
      },

      update: {
        ...job,
        sourceUrl:
          job.sourceUrl ?? null,
        deadline:
          job.deadline ?? null,
        publishedAt:
          job.publishedAt ?? null,

        isActive: true,
      },
    });

    existing ? updated++ : created++;
  }

  console.log("📡 Collector 실행 완료");
  console.log(`수집: ${collectedJobs.length}건`);
  console.log(`신규: ${created}건`);
  console.log(`갱신: ${updated}건`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
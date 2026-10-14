import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { collectG2bJobs } from "@/lib/collectors/g2bCollector";
import { mapG2bJob } from "@/lib/collectors/g2bMapper";

export async function GET(
  request: Request
) {
    
  /*
   * Vercel Cron 인증
   */
  const authorization =
    request.headers.get("authorization");

  const cronSecret =
    process.env.CRON_SECRET;

  if (
    !cronSecret ||
    authorization !==
      `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    console.log(
      "📡 [CRON] 나라장터 자동수집 시작"
    );

    /*
     * 최근 3일 / 최대 100건 조회
     */
    const rawJobs =
      await collectG2bJobs(
        3,
        1,
        100
      );

    const jobs = rawJobs
      .map(mapG2bJob)
      .filter(
        (
          job
        ): job is NonNullable<
          typeof job
        > => job !== null
      );

    /*
     * 이미 존재하는 공고를 한 번에 조회.
     *
     * 공고마다 findUnique를 호출하는 것보다
     * DB 호출 수를 줄일 수 있음.
     */
    const externalIds =
      jobs.map(
        (job) => job.externalId
      );

    const existingJobs =
      externalIds.length > 0
        ? await prisma.job.findMany({
            where: {
              source: "나라장터",

              externalId: {
                in: externalIds,
              },
            },

            select: {
              externalId: true,
            },
          })
        : [];

    const existingIdSet =
      new Set(
        existingJobs
          .map(
            (job) =>
              job.externalId
          )
          .filter(
            (
              externalId
            ): externalId is string =>
              externalId !== null
          )
      );

    let created = 0;
    let updated = 0;

    for (const job of jobs) {
      await prisma.job.upsert({
        where: {
          source_externalId: {
            source:
              job.source,

            externalId:
              job.externalId,
          },
        },

        create: {
          source:
            job.source,

          externalId:
            job.externalId,

          sourceUrl:
            job.sourceUrl ??
            null,

          title:
            job.title,

          category:
            job.category,

          budgetMin:
            job.budgetMin,

          budgetMax:
            job.budgetMax,

          workType:
            job.workType,

          estimatedHoursMin:
            job.estimatedHoursMin,

          estimatedHoursMax:
            job.estimatedHoursMax,

          tags:
            job.tags,

          summary:
            job.summary,

          deadline:
            job.deadline ??
            null,

          publishedAt:
            job.publishedAt ??
            null,

          isActive: true,
        },

        update: {
          sourceUrl:
            job.sourceUrl ??
            null,

          title:
            job.title,

          category:
            job.category,

          budgetMin:
            job.budgetMin,

          budgetMax:
            job.budgetMax,

          workType:
            job.workType,

          estimatedHoursMin:
            job.estimatedHoursMin,

          estimatedHoursMax:
            job.estimatedHoursMax,

          tags:
            job.tags,

          summary:
            job.summary,

          deadline:
            job.deadline ??
            null,

          publishedAt:
            job.publishedAt ??
            null,

          isActive: true,
        },
      });

      if (
        existingIdSet.has(
          job.externalId
        )
      ) {
        updated++;
      } else {
        created++;
      }
    }

    console.log(
      "✅ [CRON] 나라장터 자동수집 완료"
    );

    console.log(
      `원본: ${rawJobs.length}건`
    );

    console.log(
      `관련공고: ${jobs.length}건`
    );

    console.log(
      `신규: ${created}건`
    );

    console.log(
      `갱신: ${updated}건`
    );

    return NextResponse.json({
      ok: true,

      collected:
        rawJobs.length,

      matched:
        jobs.length,

      created,

      updated,

      executedAt:
        new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "❌ [CRON] 나라장터 자동수집 실패",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류",
      },
      {
        status: 500,
      }
    );
  }
}
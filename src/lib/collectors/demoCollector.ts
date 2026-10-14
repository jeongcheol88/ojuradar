import type { CollectedJob } from "./types";

export async function collectDemoJobs(): Promise<
  CollectedJob[]
> {
  return [
    {
      source: "OJURADAR-DEMO",
      externalId: "demo-001",

      sourceUrl:
        "https://example.com/jobs/demo-001",

      title:
        "Java Spring 운영 API 단기 수정",

      category: "개발 · IT",

      budgetMin: 600000,
      budgetMax: 800000,

      workType: "원격",

      estimatedHoursMin: 6,
      estimatedHoursMax: 10,

      tags: [
        "Java",
        "Spring",
        "Oracle",
      ],

      summary:
        "기존 운영 서비스의 API 오류를 분석하고 수정하는 단기 원격 프로젝트입니다.",

      publishedAt: new Date(),
      deadline: null,
    },

    {
      source: "OJURADAR-DEMO",
      externalId: "demo-002",

      sourceUrl:
        "https://example.com/jobs/demo-002",

      title:
        "엑셀 데이터 정리 및 PPT 보고서 제작",

      category: "사무 · 리서치",

      budgetMin: 300000,
      budgetMax: 400000,

      workType: "원격",

      estimatedHoursMin: 5,
      estimatedHoursMax: 8,

      tags: [
        "Excel",
        "PPT",
        "자료조사",
      ],

      summary:
        "제공된 데이터를 정리하고 주요 내용을 PPT 형태로 작성하는 프로젝트입니다.",

      publishedAt: new Date(),
      deadline: null,
    },
  ];
}
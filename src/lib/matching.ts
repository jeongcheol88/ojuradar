import type { Job } from "@/types/job";
export type RadarProfile = {
  skills: string[];
  availability: string[];
  minimumBudget: number;
  maximumHours: number;
  remoteOnly: boolean;
};
export type SkillMatchLevel =
  | "direct"
  | "strong"
  | "field"
  | "none";

export type MatchResult = {
  score: number;

  skillScore: number;
  budgetScore: number;
  timeScore: number;
  remoteScore: number;

  matchedSkills: string[];
  matchedProfileSkills: string[];
  matchedJobKeywords: string[];

  skillMatchLevel: SkillMatchLevel;

  reasons: string[];
  warnings: string[];
};

type SkillFamily = {
  profileKeywords: string[];
  jobKeywords: string[];
  categories: string[];
};

const SKILL_FAMILIES: SkillFamily[] = [
  {
    profileKeywords: [
      "java",
      "spring",
      "spring boot",
      "springboot",
      "kotlin",
      "node",
      "node.js",
      "nestjs",
      "c#",
      ".net",
      "php",
      "django",
      "fastapi",
      "go",
      "golang",
    ],

    jobKeywords: [
      "백엔드",
      "서버",
      "api",
      "웹",
      "웹 전환",
      "웹서비스",
      "웹 서비스",
      "정보시스템",
      "시스템 구축",
      "소프트웨어",
      "sw",
      "응용프로그램",
      "서비스 개발",
      "플랫폼 구축",
      "플랫폼",
      "유지보수",
      "기능 개선",
    ],

    categories: [
      "개발 · IT",
    ],
  },

  {
    profileKeywords: [
      "oracle",
      "mysql",
      "mariadb",
      "postgresql",
      "postgres",
      "sql",
      "db",
      "database",
    ],

    jobKeywords: [
      "데이터베이스",
      "database",
      "db",
      "데이터",
      "정보시스템",
      "시스템",
      "마이그레이션",
      "이관",
      "유지보수",
      "플랫폼",
    ],

    categories: [
      "개발 · IT",
    ],
  },

  {
    profileKeywords: [
      "javascript",
      "typescript",
      "react",
      "next.js",
      "nextjs",
      "vue",
      "angular",
      "html",
      "css",
    ],

    jobKeywords: [
      "프론트엔드",
      "웹",
      "웹사이트",
      "홈페이지",
      "ui",
      "웹서비스",
      "웹 서비스",
      "플랫폼",
      "기능 개선",
    ],

    categories: [
      "개발 · IT",
    ],
  },

  {
    profileKeywords: [
      "python",
      "ai",
      "인공지능",
      "machine learning",
      "머신러닝",
      "pytorch",
      "tensorflow",
    ],

    jobKeywords: [
      "ai",
      "인공지능",
      "머신러닝",
      "데이터 분석",
      "빅데이터",
      "모델 개발",
    ],

    categories: [
      "개발 · IT",
    ],
  },

  {
    profileKeywords: [
      "figma",
      "photoshop",
      "illustrator",
      "ui",
      "ux",
      "디자인",
    ],

    jobKeywords: [
      "디자인",
      "브랜딩",
      "브랜드",
      "ui",
      "ux",
      "웹디자인",
      "편집디자인",
    ],

    categories: [
      "디자인",
    ],
  },

  {
    profileKeywords: [
      "premiere",
      "after effects",
      "영상",
      "유튜브",
      "마케팅",
      "sns",
    ],

    jobKeywords: [
      "영상",
      "유튜브",
      "sns",
      "마케팅",
      "광고",
      "홍보",
      "콘텐츠 제작",
    ],

    categories: [
      "영상 · 마케팅",
    ],
  },

  {
    profileKeywords: [
      "글쓰기",
      "작가",
      "에디터",
      "번역",
      "카피라이팅",
      "콘텐츠",
    ],

    jobKeywords: [
      "원고",
      "집필",
      "번역",
      "교정",
      "교열",
      "뉴스레터",
      "콘텐츠 원고",
    ],

    categories: [
      "글쓰기 · 콘텐츠",
    ],
  },
];

type SkillMatchResult = {
  score: number;

  matchedSkills: string[];
  matchedProfileSkills: string[];
  matchedJobKeywords: string[];

  skillMatchLevel: SkillMatchLevel;

  reasons: string[];
};

function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

function buildJobText(
  job: Job
) {
  return [
    job.title,
    job.category,
    job.summary,
    job.workType,
    ...job.tags,
  ]
    .join(" ")
    .toLowerCase();
}

function calculateSkillMatch(
  job: Job,
  profile: RadarProfile
): SkillMatchResult {
  const reasons: string[] = [];

  const jobText =
    buildJobText(job);

  const normalizedSkills =
    profile.skills
      .map(normalize)
      .filter(Boolean);

  /*
   * 1. 기술명이 공고에 직접 등장
   */
  const directSkills =
    profile.skills.filter(
      (skill) =>
        jobText.includes(
          normalize(skill)
        )
    );

  if (directSkills.length > 0) {
    const matchedTags =
      job.tags.filter(
        (tag) =>
          normalizedSkills.some(
            (skill) =>
              normalize(tag).includes(
                skill
              ) ||
              skill.includes(
                normalize(tag)
              )
          )
      );

    reasons.push(
      `${directSkills
        .slice(0, 3)
        .join(", ")} 기술이 공고에 직접 나타납니다.`
    );

  return {
    score: 50,

    matchedSkills:
      matchedTags.length > 0
        ? matchedTags
        : directSkills,

    matchedProfileSkills:
      directSkills,

    matchedJobKeywords:
      directSkills,

    skillMatchLevel:
      "direct",

    reasons,
  };
  }

  /*
   * 2. 내 기술과 연결되는 기술군
   */
  const matchedFamilies =
    SKILL_FAMILIES.filter(
      (family) =>
        family.profileKeywords.some(
          (keyword) =>
            normalizedSkills.some(
              (skill) =>
                skill.includes(
                  keyword
                ) ||
                keyword.includes(
                  skill
                )
            )
        )
    );

  /*
   * 실제 공고에 관련 업무가 존재하는
   * 기술군만 남김
   */
  const activeFamilies =
    matchedFamilies.filter(
      (family) =>
        family.jobKeywords.some(
          (keyword) =>
            jobText.includes(
              normalize(keyword)
            )
        )
    );

  /*
   * 실제 연관된 내 기술
   */
  const matchedProfileSkills =
    profile.skills.filter(
      (profileSkill) => {
        const skill =
          normalize(
            profileSkill
          );

        return activeFamilies.some(
          (family) =>
            family.profileKeywords.some(
              (keyword) =>
                skill.includes(
                  normalize(keyword)
                ) ||
                normalize(
                  keyword
                ).includes(
                  skill
                )
            )
        );
      }
    );

  /*
   * 공고에서 발견된 업무 키워드
   */
  const relatedJobKeywords =
    Array.from(
      new Set(
        activeFamilies.flatMap(
          (family) =>
            family.jobKeywords
        )
      )
    );

  const matchedJobKeywords =
    relatedJobKeywords.filter(
      (keyword) =>
        jobText.includes(
          normalize(keyword)
        )
    );

  const strongKeywords = [
    "백엔드",
    "api",
    "웹 전환",
    "웹서비스",
    "웹 서비스",
    "정보시스템",
    "시스템 구축",
    "소프트웨어",
    "sw",
    "응용프로그램",
    "서비스 개발",
    "데이터베이스",
    "database",
    "db",
    "마이그레이션",
    "이관",
    "유지보수",
    "기능 개선",
  ];

  const mediumKeywords = [
    "웹",
    "서버",
    "데이터",
    "플랫폼 구축",
    "플랫폼",
    "클라우드",
    "시스템",
  ];

  const strongMatches =
    matchedJobKeywords.filter(
      (keyword) =>
        strongKeywords.some(
          (strong) =>
            normalize(
              keyword
            ).includes(
              normalize(strong)
            ) ||
            normalize(
              strong
            ).includes(
              normalize(keyword)
            )
        )
    );

  const mediumMatches =
    matchedJobKeywords.filter(
      (keyword) =>
        mediumKeywords.some(
          (medium) =>
            normalize(
              keyword
            ).includes(
              normalize(medium)
            ) ||
            normalize(
              medium
            ).includes(
              normalize(keyword)
            )
        )
    );

  const matchedTags =
    job.tags.filter(
      (tag) =>
        matchedJobKeywords.some(
          (keyword) =>
            normalize(tag).includes(
              normalize(keyword)
            ) ||
            normalize(
              keyword
            ).includes(
              normalize(tag)
            )
        )
    );

  /*
   * 강한 연관
   */
  if (strongMatches.length > 0) {
    reasons.push(
      `${matchedProfileSkills
        .slice(0, 3)
        .join(", ")} 기술과 연관된 업무(${strongMatches
        .slice(0, 3)
        .join(", ")})입니다.`
    );

    return {
      score: 40,

      matchedSkills:
        matchedTags.length > 0
          ? matchedTags
          : strongMatches.slice(
              0,
              3
            ),

      matchedProfileSkills,

      matchedJobKeywords:
        strongMatches,

      skillMatchLevel:
        "strong",

      reasons,
    };
  }

  /*
   * 중간 연관
   */
  if (mediumMatches.length > 0) {
    reasons.push(
      `${matchedProfileSkills
        .slice(0, 3)
        .join(", ")} 기술과 연관 가능성이 있는 업무(${mediumMatches
        .slice(0, 3)
        .join(", ")})입니다.`
    );

    return {
      score: 30,

      matchedSkills:
        matchedTags.length > 0
          ? matchedTags
          : mediumMatches.slice(
              0,
              3
            ),

      matchedProfileSkills,

      matchedJobKeywords:
        mediumMatches,

      skillMatchLevel:
        "field",

      reasons,
    };
  }

  /*
   * 같은 분야 카테고리
   */
  const relatedCategories =
    Array.from(
      new Set(
        matchedFamilies.flatMap(
          (family) =>
            family.categories
        )
      )
    );

  if (
    relatedCategories.includes(
      job.category
    )
  ) {
    const categorySkills =
      profile.skills.filter(
        (profileSkill) => {
          const skill =
            normalize(
              profileSkill
            );

          return matchedFamilies.some(
            (family) =>
              family.profileKeywords.some(
                (keyword) =>
                  skill.includes(
                    normalize(keyword)
                  ) ||
                  normalize(
                    keyword
                  ).includes(
                    skill
                  )
              )
          );
        }
      );

    reasons.push(
      "구체적인 기술스택은 확인되지 않지만 내 기술 분야와 같은 카테고리입니다."
    );

    return {
      score: 15,
      matchedSkills: [],

      matchedProfileSkills:
        categorySkills,

      matchedJobKeywords: [],

      skillMatchLevel:
        "field",

      reasons,
    };
  }

  /*
   * 연관 없음
   */
    return {
      score: 0,
      matchedSkills: [],
      matchedProfileSkills: [],
      matchedJobKeywords: [],

      skillMatchLevel:
        "none",

      reasons,
    };
}

export function calculateJobMatch(
  job: Job,
  profile: RadarProfile
): MatchResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  /*
   * 기술 적합도
   * 최대 50점
   */
  const skillResult =
    calculateSkillMatch(
      job,
      profile
    );

  const skillScore =
    skillResult.score;

  reasons.push(
    ...skillResult.reasons
  );

  /*
   * 예산 적합도
   * 최대 20점
   */
  let budgetScore = 0;

  if (
    job.budgetMax >=
    profile.minimumBudget
  ) {
    budgetScore = 20;

    reasons.push(
      "희망 최소금액 이상의 프로젝트입니다."
    );
  } else if (
    job.budgetMax >=
    profile.minimumBudget * 0.75
  ) {
    budgetScore = 10;

    warnings.push(
      "희망 최소금액보다 조금 낮은 프로젝트입니다."
    );
  } else {
    warnings.push(
      "희망 최소금액보다 예산이 낮습니다."
    );
  }

  /*
   * 시간 적합도
   * 최대 20점
   */
  let timeScore = 0;

  if (
    job.estimatedHoursMin <= 0 ||
    job.estimatedHoursMax <= 0
  ) {
    warnings.push(
      "예상 작업시간 정보가 없어 시간 적합도는 계산하지 않았습니다."
    );
  } else if (
    job.estimatedHoursMax <=
    profile.maximumHours
  ) {
    timeScore = 20;

    reasons.push(
      "희망 작업시간 안에 완료 가능한 프로젝트입니다."
    );
  } else if (
    job.estimatedHoursMin <=
    profile.maximumHours
  ) {
    timeScore = 10;

    warnings.push(
      "작업시간에 따라 희망 시간을 초과할 수 있습니다."
    );
  } else {
    warnings.push(
      "예상 작업시간이 희망 시간을 초과합니다."
    );
  }

  /*
   * 작업방식 적합도
   * 최대 10점
   */
  let remoteScore = 0;

  if (!profile.remoteOnly) {
    remoteScore = 10;
  } else {
    const workText = [
      job.workType,
      job.title,
      job.summary,
    ]
      .join(" ")
      .toLowerCase();

    if (
      workText.includes(
        "원격"
      ) ||
      workText.includes(
        "재택"
      )
    ) {
      remoteScore = 10;

      reasons.push(
        "원격으로 진행 가능한 프로젝트입니다."
      );
    } else {
      warnings.push(
        "원격 가능 여부를 공고에서 확인해야 합니다."
      );
    }
  }

  const score =
    Math.max(
      0,
      Math.min(
        100,
        skillScore +
          budgetScore +
          timeScore +
          remoteScore
      )
    );

    return {
      score,

      skillScore,
      budgetScore,
      timeScore,
      remoteScore,

      matchedSkills:
        skillResult.matchedSkills,

      matchedProfileSkills:
        skillResult.matchedProfileSkills,

      matchedJobKeywords:
        skillResult.matchedJobKeywords,

      skillMatchLevel:
        skillResult.skillMatchLevel,

      reasons,
      warnings,
    };
}
import type { Job } from "@/types/job";

export type RadarProfile = {
  skills: string[];
  availability: string[];
  minimumBudget: number;
  maximumHours: number;
  remoteOnly: boolean;
};

export type MatchResult = {
  score: number;

  skillScore: number;
  budgetScore: number;
  timeScore: number;
  remoteScore: number;

  matchedSkills: string[];
  reasons: string[];
  
  warnings: string[];
};

export function calculateJobMatch(
  job: Job,
  profile: RadarProfile
): MatchResult {
  /*
   * 외주레이더 매칭점수 v0.1
   *
   * 기술 적합도 : 50점
   * 금액 적합도 : 20점
   * 시간 적합도 : 20점
   * 원격 적합도 : 10점
   *
   * 총점         : 100점
   */

  let skillScore = 0;
  let budgetScore = 0;
  let timeScore = 0;
  let remoteScore = 0;

  const reasons: string[] = [];
  const warnings: string[] = [];

  /*
   * --------------------------------------------------
   * 1. 기술 적합도
   * --------------------------------------------------
   */
  const matchedSkills = job.tags.filter((tag) =>
    profile.skills.some(
      (skill) =>
        skill.toLowerCase() === tag.toLowerCase()
    )
  );

  if (job.tags.length > 0) {
    const skillRatio =
      matchedSkills.length / job.tags.length;

    skillScore = Math.round(skillRatio * 50);
  }

    if (matchedSkills.length > 0) {
    reasons.push(
        `${matchedSkills.join(", ")} 기술이 공고와 일치합니다.`
    );
    } else {
    warnings.push(
        "내 레이더에 등록된 업무와 직접 일치하는 기술이 없습니다."
    );
    }
  /*
   * --------------------------------------------------
   * 2. 금액 적합도
   * --------------------------------------------------
   */
    if (job.budgetMax >= profile.minimumBudget) {
    budgetScore = 20;

    reasons.push(
        "희망 최소금액 이상의 프로젝트입니다."
    );
    } else if (
    job.budgetMax >= profile.minimumBudget * 0.8
    ) {
    budgetScore = 10;

    warnings.push(
        "희망 최소금액보다 다소 낮습니다."
    );
    } else {
    warnings.push(
        "희망 최소금액보다 낮은 프로젝트입니다."
    );
    }

  /*
   * --------------------------------------------------
   * 3. 작업시간 적합도
   * --------------------------------------------------
   */
  if (
    job.estimatedHoursMin <= 0 ||
    job.estimatedHoursMax <= 0
  ) {
    timeScore = 0;

    warnings.push(
      "예상 작업시간 정보가 없어 시간 적합도는 계산하지 않았습니다."
    );
  } else if (
    job.estimatedHoursMax <= profile.maximumHours
  ) {
    timeScore = 20;

    reasons.push(
      "희망 최대 작업시간 이내입니다."
    );
  } else if (
    job.estimatedHoursMin <= profile.maximumHours
  ) {
    timeScore = 10;

    warnings.push(
      "예상 작업시간이 희망 범위를 초과할 수 있습니다."
    );
  } else {
    timeScore = 0;

    warnings.push(
      "예상 작업시간이 희망 최대 작업시간보다 깁니다."
    );
  }
  /*
   * --------------------------------------------------
   * 4. 원격 적합도
   * --------------------------------------------------
   */
    if (!profile.remoteOnly) {
    remoteScore = 10;
    } else if (job.workType === "원격") {
    remoteScore = 10;

    reasons.push("원격 작업이 가능합니다.");
    } else {
    warnings.push(
        "원격 전용 조건과 맞지 않는 프로젝트입니다."
    );
    }

  const score =
    skillScore +
    budgetScore +
    timeScore +
    remoteScore;

    return {
    score,
    skillScore,
    budgetScore,
    timeScore,
    remoteScore,
    matchedSkills,
    reasons,
    warnings,
    };
}
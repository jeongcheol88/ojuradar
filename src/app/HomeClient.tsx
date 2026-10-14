"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import type { Job } from "@/types/job";

import {
  calculateJobMatch,
  type MatchResult,
  type RadarProfile,
} from "@/lib/matching";

import {
  calculateJobQuality,
  type JobQualityResult,
} from "@/lib/jobQuality";

type HomeClientProps = {
  jobs: Job[];
};

type JobWithMatch = Job & {
  match: MatchResult | null;
  quality: JobQualityResult;
};

const BUDGET_OPTIONS = [
  {
    value: 0,
    label: "전체 예산",
  },
  {
    value: 100000,
    label: "10만원 이상",
  },
  {
    value: 300000,
    label: "30만원 이상",
  },
  {
    value: 500000,
    label: "50만원 이상",
  },
  {
    value: 1000000,
    label: "100만원 이상",
  },
];

function getDeadlineInfo(
  deadline: string | null
) {
  if (!deadline) {
    return null;
  }

  const now = new Date();
  const end = new Date(deadline);

  if (Number.isNaN(end.getTime())) {
    return null;
  }

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const endDay = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  const diffDays = Math.ceil(
    (endDay.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return {
      label: "마감",
      expired: true,
    };
  }

  if (diffDays === 0) {
    return {
      label: "오늘 마감",
      expired: false,
    };
  }

  return {
    label: `D-${diffDays}`,
    expired: false,
  };
}

function getScoreStyle(score: number) {
  if (score >= 80) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (score >= 60) {
    return "border-blue-500/30 bg-blue-500/10 text-blue-300";
  }

  return "border-slate-600 bg-slate-800 text-slate-300";
}

export default function HomeClient({
  jobs,
}: HomeClientProps) {
  const categoryOptions = useMemo(
    () => [
      "전체",
      ...Array.from(
        new Set(
          jobs.map((job) => job.category)
        )
      ),
    ],
    [jobs]
  );

  const workTypeOptions = useMemo(
    () => [
      "전체",
      ...Array.from(
        new Set(
          jobs
            .map((job) => job.workType)
            .filter(Boolean)
        )
      ),
    ],
    [jobs]
  );

  const [profile, setProfile] =
    useState<RadarProfile | null>(null);

  // 사용자가 입력 중인 검색어
  const [searchInput, setSearchInput] =
    useState("");

  // 실제 검색에 적용된 검색어
  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [category, setCategory] =
    useState("전체");

  const [workType, setWorkType] =
    useState("전체");

  const [minimumBudget, setMinimumBudget] =
    useState(0);

  const [showAllJobs, setShowAllJobs] =
    useState(false);
  /*
   * 저장된 내 레이더 설정 불러오기
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedProfile =
          window.localStorage.getItem(
            "ojuradar-profile"
          );

        if (!savedProfile) {
          return;
        }

        const parsed =
          JSON.parse(savedProfile) as RadarProfile;

        setProfile(parsed);
      } catch (error) {
        console.error(
          "레이더 설정을 불러오지 못했습니다.",
          error
        );
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /*
   * DB 공고 + 레이더 매칭
   */
const analyzedJobs =
  useMemo<JobWithMatch[]>(() => {
    return jobs.map((job) => ({
      ...job,

      match: profile
        ? calculateJobMatch(
            job,
            profile
          )
        : null,

      quality:
        calculateJobQuality(
          job
        ),
    }));
  }, [jobs, profile]);

  /*
   * 검색 / 필터 / 정렬
   */
  const visibleJobs = useMemo(() => {
    const keyword =
      searchKeyword.trim().toLowerCase();

    return analyzedJobs
      /*
      * 검색어
      */
      .filter((job) => {
        if (!keyword) {
          return true;
        }

        const searchableText = [
          job.title,
          job.category,
          job.source,
          job.summary,
          job.workType,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          keyword
        );
      })

      /*
      * 카테고리
      */
      .filter((job) => {
        if (category === "전체") {
          return true;
        }

        return (
          job.category === category
        );
      })

      /*
      * 작업방식
      */
      .filter((job) => {
        if (workType === "전체") {
          return true;
        }

        return (
          job.workType === workType
        );
      })

      /*
      * 최소 예산
      */
      .filter((job) => {
        if (minimumBudget === 0) {
          return true;
        }

        return (
          job.budgetMax >=
          minimumBudget
        );
      })

      /*
      * 외주 적합도가 너무 낮은 공고는
      * 기본 화면에서 숨김.
      *
      * "모든 공고 보기"를 누르면
      * 점수와 관계없이 표시.
      */
      .filter((job) => {
        if (showAllJobs) {
          return true;
        }

        return (
          job.quality.score >= 40
        );
      })

      /*
      * 1순위: 내 레이더 점수
      * 2순위: 외주 적합도
      * 3순위: 최신 DB ID
      */
      .sort((a, b) => {
        const scoreA =
          a.match?.score ?? a.score;

        const scoreB =
          b.match?.score ?? b.score;

        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }

        if (
          a.quality.score !==
          b.quality.score
        ) {
          return (
            b.quality.score -
            a.quality.score
          );
        }

        return b.id - a.id;
      });
  }, [
    analyzedJobs,
    searchKeyword,
    category,
    workType,
    minimumBudget,
    showAllJobs,
  ]);

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSearchKeyword(
      searchInput.trim()
    );
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchKeyword("");
    setCategory("전체");
    setWorkType("전체");
    setMinimumBudget(0);

    // 기본 상태는 좋은 공고만 표시
    setShowAllJobs(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black">
              R
            </div>

            <div>
              <div className="font-bold">
                외주레이더
              </div>

              <div className="text-xs text-slate-500">
                OJURADAR
              </div>
            </div>
          </Link>

          <Link
            href="/radar"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold transition hover:border-blue-500 hover:text-blue-300"
          >
            내 레이더 설정
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* HERO */}
        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            📡 나에게 돈 되는 일거리 탐색
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
            수많은 일거리 중
            <br />
            <span className="text-blue-400">
              나에게 돈 되는 일
            </span>
            만 찾아드립니다.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            외주레이더가 프로젝트의 예산,
            예상 작업시간, 내 기술 적합도를
            분석해서 우선순위를 보여드립니다.
          </p>
        </section>

        {/* SUMMARY */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-sm text-slate-500">
              전체 수집 일거리
            </div>

            <div className="mt-2 text-3xl font-black">
              {jobs.length}
              <span className="ml-1 text-base font-medium text-slate-500">
                건
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-sm text-slate-500">
              검색 결과
            </div>

            <div className="mt-2 text-3xl font-black text-blue-400">
              {visibleJobs.length}
              <span className="ml-1 text-base font-medium text-slate-500">
                건
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-sm text-slate-500">
              내 레이더
            </div>

            <div className="mt-2 text-lg font-bold">
              {profile
                ? "적용 중"
                : "미설정"}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {profile
                ? `${profile.skills.length}개 기술 기준 추천`
                : "레이더를 설정하면 맞춤 점수를 계산합니다."}
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <form
            onSubmit={
              handleSearchSubmit
            }
            className="flex flex-col gap-3 md:flex-row"
          >
            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="기술, 업무, 출처 검색 (예: Java, 나라장터, 디자인)"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500"
            >
              검색
            </button>
          </form>
        </section>

        {/* FILTER */}
        <section className="mb-10 flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            {categoryOptions.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value === "전체"
                    ? "전체 카테고리"
                    : value}
                </option>
              )
            )}
          </select>

          <select
            value={workType}
            onChange={(event) =>
              setWorkType(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            {workTypeOptions.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value === "전체"
                    ? "전체 작업방식"
                    : value}
                </option>
              )
            )}
          </select>

          <select
            value={minimumBudget}
            onChange={(event) =>
              setMinimumBudget(
                Number(
                  event.target.value
                )
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            {BUDGET_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white"
          >
            필터 초기화
          </button>
        </section>

        {/* RESULT HEADER */}
        <section className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">
              추천 일거리
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {showAllJobs
                ? "필터 조건에 맞는 모든 공고를 보여드립니다."
                : "외주 적합도 40점 이상 공고를 우선 보여드립니다."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {visibleJobs.length}건
            </span>

            <button
              type="button"
              onClick={() =>
                setShowAllJobs(
                  (current) => !current
                )
              }
              className={
                showAllJobs
                  ? "rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                  : "rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
              }
            >
              {showAllJobs
                ? "추천 공고만 보기"
                : "모든 공고 보기"}
            </button>
          </div>
        </section>

        {/* JOB LIST */}
        {visibleJobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleJobs.map((job) => {
              const score =
                job.match?.score ??
                job.score;

              const deadlineInfo =
                getDeadlineInfo(
                  job.deadline
                );

              return (
                <article
                  key={job.id}
                  className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-slate-700"
                >
                  {/* CARD TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                        {job.category}
                      </span>

                      {deadlineInfo && (
                        <span
                          className={
                            deadlineInfo.expired
                              ? "rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300"
                              : "rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                          }
                        >
                          {
                            deadlineInfo.label
                          }
                        </span>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className={
                          profile
                            ? `rounded-full border px-3 py-1 text-xs font-bold ${getScoreStyle(
                                score
                              )}`
                            : "rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400"
                        }
                      >
                        {profile
                          ? `내 레이더 ${score}점`
                          : "레이더 미설정"}
                      </span>

                      <span
                        className={
                          job.quality.score >= 75
                            ? "rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300"
                            : job.quality.score >= 55
                              ? "rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300"
                              : "rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400"
                        }
                      >
                        외주 적합도{" "}
                        {job.quality.score}점
                      </span>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-5 text-xl font-bold leading-8">
                    {job.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {job.summary}
                  </p>

                  {/* DATA */}
                  <div className="mt-6 space-y-3 rounded-xl bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        예산
                      </span>

                      <span className="text-right text-sm font-bold text-white">
                        {job.budget}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        예상 작업시간
                      </span>

                      <span className="text-right text-sm font-semibold">
                        {
                          job.estimatedTime
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        예상 시급
                      </span>

                      <span className="text-right text-sm font-semibold text-emerald-300">
                        {job.hourlyRate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        작업방식
                      </span>

                      <span className="text-right text-sm font-semibold">
                        {job.workType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      입찰 난이도
                    </span>

                    <span className="text-right text-sm font-semibold">
                      {job.quality.difficulty}
                    </span>
                  </div>

                  {/* TAGS */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.tags.map(
                      (tag) => {
                        const matched =
                          job.match?.matchedSkills.includes(
                            tag
                          );

                        return (
                          <span
                            key={tag}
                            className={
                              matched
                                ? "rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300"
                                : "rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
                            }
                          >
                            {tag}
                          </span>
                        );
                      }
                    )}
                  </div>

                  {/* MATCH REASON */}
                  {job.match &&
                    job.match.reasons
                      .length > 0 && (
                      <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <div className="text-xs font-bold text-emerald-300">
                          왜 추천했나요?
                        </div>

                        <div className="mt-2 text-sm leading-6 text-slate-400">
                          {
                            job.match
                              .reasons[0]
                          }
                        </div>
                      </div>
                    )}

                  {/* 아래 버튼들을 카드 하단으로 */}
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="block w-full rounded-xl bg-slate-800 py-3 text-center font-semibold transition hover:bg-blue-600"
                    >
                      상세 분석 보기
                    </Link>

                    {job.sourceUrl && (
                      <a
                        href={
                          job.sourceUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block w-full rounded-xl border border-blue-500/40 bg-blue-500/10 py-3 text-center font-semibold text-blue-300 transition hover:bg-blue-500/20"
                      >
                        원문 공고 보기 ↗
                      </a>
                    )}

                    <div className="mt-3 text-center text-xs text-slate-600">
                      출처: {job.source}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 py-20 text-center">
            <div className="text-xl font-bold">
              조건에 맞는 일거리가
              없습니다.
            </div>

            <p className="mt-3 text-sm text-slate-500">
              검색어나 필터 조건을 조금
              완화해보세요.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              검색조건 초기화
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
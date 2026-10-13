"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { jobs } from "@/data/jobs";

import {
  calculateJobMatch,
  type RadarProfile,
} from "@/lib/matching";

const CATEGORY_OPTIONS = [
  "전체",
  ...Array.from(
    new Set(
      jobs.map((job) => job.category)
    )
  ),
];

const BUDGET_OPTIONS = [
  { label: "금액 전체", value: 0 },
  { label: "10만원 이상", value: 100000 },
  { label: "30만원 이상", value: 300000 },
  { label: "50만원 이상", value: 500000 },
  { label: "100만원 이상", value: 1000000 },
];

export default function Home() {
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

  /*
   * 저장된 내 레이더 설정 불러오기
   */
  useEffect(() => {
    const savedProfile =
      localStorage.getItem("ojuradar-profile");

    if (!savedProfile) {
      return;
    }

    try {
      const parsedProfile: RadarProfile =
        JSON.parse(savedProfile);

      setTimeout(() => {
        setProfile(parsedProfile);
      }, 0);
    } catch {
      console.error(
        "레이더 설정을 불러올 수 없습니다."
      );
    }
  }, []);

  /*
   * --------------------------------------------------
   * 공고 점수 계산 + 검색 + 필터 + 정렬
   * --------------------------------------------------
   */
  const filteredJobs = useMemo(() => {
    const keyword =
      searchKeyword.trim().toLowerCase();

    return jobs
      .map((job) => ({
        ...job,

        match: profile
          ? calculateJobMatch(job, profile)
          : null,
      }))
      .filter((job) => {
        /*
         * 검색어
         */
        const searchableText = [
          job.title,
          job.category,
          job.source,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase();

        const keywordMatched =
          keyword === "" ||
          searchableText.includes(keyword);

        /*
         * 분야
         */
        const categoryMatched =
          category === "전체" ||
          job.category === category;

        /*
         * 작업방식
         */
        const workTypeMatched =
          workType === "전체" ||
          job.workType === workType;

        /*
         * 최소금액
         */
        const budgetMatched =
          job.budgetMax >= minimumBudget;

        return (
          keywordMatched &&
          categoryMatched &&
          workTypeMatched &&
          budgetMatched
        );
      })
      .sort(
        (a, b) =>
          (b.match?.score ?? b.score) -
          (a.match?.score ?? a.score)
      );
  }, [
    profile,
    searchKeyword,
    category,
    workType,
    minimumBudget,
  ]);

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSearchKeyword(searchInput);
  }

  function resetFilters() {
    setSearchInput("");
    setSearchKeyword("");
    setCategory("전체");
    setWorkType("전체");
    setMinimumBudget(0);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* 헤더 */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
              R
            </div>

            <div>
              <div className="text-lg font-bold">
                외주레이더
              </div>

              <div className="text-xs text-slate-400">
                AI 일거리 탐색 서비스
              </div>
            </div>
          </Link>

          <Link
            href="/radar"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            내 레이더
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* 메인 소개 */}
        <section className="mb-10">
          <div className="mb-3 text-sm font-semibold text-blue-400">
            AI PROJECT MATCHING
          </div>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            수많은 일거리 중
            <br />

            <span className="text-blue-400">
              나에게 돈 되는 일만
            </span>{" "}
            찾아드립니다.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            외주, 부업, 프로젝트를 일일이
            찾아다니지 마세요.
            <br className="hidden md:block" />
            외주레이더가 내 능력과 시간,
            희망수익을 분석해 가장 적합한 일을
            추천합니다.
          </p>
        </section>

        {/* 요약 */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="전체 수집 일거리"
            value={jobs.length}
            unit="건"
          />

          <SummaryCard
            label="현재 검색 결과"
            value={filteredJobs.length}
            unit="건"
            highlight
          />

          <SummaryCard
            label="내 레이더"
            value={profile ? "ON" : "OFF"}
          />
        </section>

        {/* 검색 */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
              placeholder="어떤 일을 찾고 있나요? 예: Java, 글쓰기, 영상편집"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-base outline-none placeholder:text-slate-500 focus:border-blue-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500"
            >
              공고 검색
            </button>
          </form>

          {/* 필터 */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* 분야 */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            >
              {CATEGORY_OPTIONS.map(
                (value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value === "전체"
                      ? "분야 전체"
                      : value}
                  </option>
                )
              )}
            </select>

            {/* 작업방식 */}
            <select
              value={workType}
              onChange={(event) =>
                setWorkType(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="전체">
                작업방식 전체
              </option>

              <option value="원격">
                원격
              </option>

              <option value="상주">
                상주
              </option>

              <option value="혼합">
                혼합
              </option>
            </select>

            {/* 최소금액 */}
            <select
              value={minimumBudget}
              onChange={(event) =>
                setMinimumBudget(
                  Number(event.target.value)
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
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

            {/* 초기화 */}
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-700 px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              검색조건 초기화
            </button>
          </div>

          {/* 적용된 검색어 */}
          {searchKeyword && (
            <div className="mt-4 text-sm text-slate-400">
              검색어{" "}
              <strong className="text-blue-400">
                &quot;{searchKeyword}&quot;
              </strong>
              에 대한 결과입니다.
            </div>
          )}
        </section>

        {/* 추천 공고 */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                AI 추천 일거리
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                검색조건과 내 레이더를 함께
                반영했습니다.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              {filteredJobs.length}건
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {filteredJobs.map((job) => {
                const score =
                  job.match?.score ??
                  job.score;

                return (
                  <article
                    key={job.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-700"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <div className="mb-2 text-xs text-slate-500">
                          {job.category}
                        </div>

                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-400">
                          AI 추천 {score}점
                        </span>
                      </div>

                      <button
                        type="button"
                        className="text-xl text-slate-500 hover:text-white"
                        aria-label="관심 공고"
                      >
                        ☆
                      </button>
                    </div>

                    <h3 className="min-h-14 text-xl font-bold leading-7">
                      {job.title}
                    </h3>

                    <div className="mt-5 space-y-3 border-y border-slate-800 py-5 text-sm">
                      <JobInfoRow
                        label="예산"
                        value={job.budget}
                      />

                      <JobInfoRow
                        label="예상 작업시간"
                        value={
                          job.estimatedTime
                        }
                      />

                      <JobInfoRow
                        label="예상 시급"
                        value={
                          job.hourlyRate
                        }
                        highlight
                      />

                      <JobInfoRow
                        label="작업방식"
                        value={job.workType}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.tags.map(
                        (tag) => (
                          <span
                            key={tag}
                            className={`rounded-md px-2.5 py-1 text-xs ${
                              job.match?.matchedSkills.includes(
                                tag
                              )
                                ? "bg-blue-500/15 text-blue-400"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="mt-6 block w-full rounded-xl bg-slate-800 py-3 text-center font-semibold transition hover:bg-blue-600"
                    >
                      상세 분석 보기
                    </Link>

                    <div className="mt-3 text-center text-xs text-slate-600">
                      출처: {job.source}
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
        </section>

        {/* 설명 */}
        <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-900 p-7 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-blue-400">
                WHY OJURADAR?
              </div>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                공고를 보여주는 데서
                <br />
                끝나지 않습니다.
              </h2>
            </div>

            <div className="space-y-3 text-slate-400">
              <p>
                ✓ 내가 실제로 할 수 있는 일인지
                분석
              </p>

              <p>
                ✓ 예상 작업시간과 예상 시급 계산
              </p>

              <p>
                ✓ 일정·난이도·리스크까지 AI가
                평가
              </p>

              <p>
                ✓ 지원할 가치가 있는 공고만 추천
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-16 border-t border-slate-800 py-8 text-center text-sm text-slate-600">
        © 2026 외주레이더 · AI Project Matching
        Service
      </footer>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: number | string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="text-sm text-slate-400">
        {label}
      </div>

      <div
        className={`mt-2 text-3xl font-bold ${
          highlight
            ? "text-blue-400"
            : ""
        }`}
      >
        {value}

        {unit && (
          <span className="ml-1 text-base font-normal text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function JobInfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">
        {label}
      </span>

      <strong
        className={
          highlight
            ? "text-emerald-400"
            : ""
        }
      >
        {value}
      </strong>
    </div>
  );
}
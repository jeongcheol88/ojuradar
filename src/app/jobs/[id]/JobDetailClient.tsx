"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Job } from "@/data/jobs";

import {
  calculateJobMatch,
  type MatchResult,
  type RadarProfile,
} from "@/lib/matching";

type Props = {
  job: Job;
};

export default function JobDetailClient({
  job,
}: Props) {
  const [match, setMatch] =
    useState<MatchResult | null>(null);

  useEffect(() => {
    const savedProfile =
      localStorage.getItem("ojuradar-profile");

    if (!savedProfile) {
      return;
    }

    try {
      const profile: RadarProfile =
        JSON.parse(savedProfile);

      const result =
        calculateJobMatch(job, profile);

      setTimeout(() => {
        setMatch(result);
      }, 0);
    } catch {
      console.error(
        "레이더 설정을 불러올 수 없습니다."
      );
    }
  }, [job]);

  const score = match?.score ?? job.score;

  const reasons =
    match?.reasons ?? job.reasons;

  const warnings =
    match?.warnings ?? job.risks;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* 헤더 */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
              R
            </div>

            <div>
              <div className="font-bold">
                외주레이더
              </div>

              <div className="text-xs text-slate-400">
                AI 일거리 탐색 서비스
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← 추천공고
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* 제목 */}
        <section>
          <div className="text-sm text-slate-500">
            {job.category}
          </div>

          <div className="mt-3 inline-block rounded-full bg-blue-500/10 px-4 py-2 font-bold text-blue-400">
            AI 추천 {score}점
          </div>

          <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
            {job.title}
          </h1>

          <div className="mt-4 text-sm text-slate-500">
            출처 · {job.source}
          </div>
        </section>

        {/* 핵심 정보 */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            label="예산"
            value={job.budget}
          />

          <InfoCard
            label="예상 작업시간"
            value={job.estimatedTime}
          />

          <InfoCard
            label="예상 시급"
            value={job.hourlyRate}
            highlight
          />

          <InfoCard
            label="작업 방식"
            value={job.workType}
          />
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {/* AI 분석 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                외주레이더 AI 분석
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {job.summary}
              </p>
            </section>

            {/* 추천 이유 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                왜 추천했나요?
              </h2>

              <div className="mt-5 space-y-4">
                {reasons.length > 0 ? (
                  reasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="font-bold text-emerald-400">
                        ✓
                      </span>

                      <span>{reason}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">
                    현재 조건에서 특별한 추천
                    요소가 없습니다.
                  </div>
                )}
              </div>
            </section>

            {/* 감점 / 주의사항 */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-xl font-bold">
                확인해야 할 조건
              </h2>

              <div className="mt-5 space-y-4">
                {warnings.length > 0 ? (
                  warnings.map((warning) => (
                    <div
                      key={warning}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="font-bold text-amber-400">
                        !
                      </span>

                      <span>{warning}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-emerald-400">
                    ✓ 현재 레이더 조건에서
                    특별한 감점 요소가 없습니다.
                  </div>
                )}
              </div>
            </section>

            {/* 기술 */}
            <section>
              <h2 className="text-xl font-bold">
                관련 기술 / 업무
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      match?.matchedSkills.includes(tag)
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* 우측 결과 */}
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-sm text-slate-400">
                외주레이더 판단
              </div>

              <div className="mt-2 text-3xl font-bold text-blue-400">
                {score >= 80
                  ? "지원 추천"
                  : score >= 60
                    ? "검토 추천"
                    : "우선순위 낮음"}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                AI 적합도 {score}점
              </div>

              <div className="my-6 border-t border-slate-800" />

              {match && (
                <div className="mb-6 space-y-3 text-sm">
                  <ScoreRow
                    label="기술 적합도"
                    value={match.skillScore}
                    max={50}
                  />

                  <ScoreRow
                    label="금액 적합도"
                    value={match.budgetScore}
                    max={20}
                  />

                  <ScoreRow
                    label="시간 적합도"
                    value={match.timeScore}
                    max={20}
                  />

                  <ScoreRow
                    label="원격 적합도"
                    value={match.remoteScore}
                    max={10}
                  />
                </div>
              )}

              <div className="space-y-4 border-t border-slate-800 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    예산
                  </span>

                  <strong>{job.budget}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    예상 시간
                  </span>

                  <strong>
                    {job.estimatedTime}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    예상 시급
                  </span>

                  <strong className="text-emerald-400">
                    {job.hourlyRate}
                  </strong>
                </div>
              </div>

              <button className="mt-7 w-full rounded-xl bg-blue-600 py-4 font-bold transition hover:bg-blue-500">
                AI 제안서 만들기
              </button>

              <button className="mt-3 w-full rounded-xl border border-slate-700 py-4 font-semibold text-slate-300 transition hover:bg-slate-800">
                ☆ 관심 공고
              </button>

              <button
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-xl bg-slate-800 py-4 text-sm text-slate-500"
              >
                원문 연결 예정
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div
        className={`mt-2 text-xl font-bold ${
          highlight
            ? "text-emerald-400"
            : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="text-slate-500">
          {label}
        </span>

        <strong>
          {value} / {max}
        </strong>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${(value / max) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
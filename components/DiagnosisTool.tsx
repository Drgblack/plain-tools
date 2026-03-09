"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"

import { DiagnosisResultCard } from "@/components/DiagnosisResultCard"
import {
  DEVICE_OPTIONS,
  EMPTY_DIAGNOSIS_INPUTS,
  FILE_TYPE_OPTIONS,
  GOAL_OPTIONS,
  MAIN_PROBLEM_OPTIONS,
  diagnose,
  getDiagnosisInitialInputs,
  hasDiagnosisPrefill,
  type DiagnosisDevice,
  type DiagnosisFileType,
  type DiagnosisGoal,
  type DiagnosisInputs,
  type DiagnosisProblem,
  type Recommendation,
} from "@/lib/diagnosis-rules"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const problemLabels: Record<DiagnosisProblem, string> = {
  "too-large": "Too large",
  "wont-open": "Won't open",
  "cant-edit": "Can't edit",
  "password-protected": "Password protected",
  "scanned-document": "Scanned document",
  "need-merge": "Need to merge",
  "need-split": "Need to split",
  "need-convert": "Need to convert",
  other: "Other",
}

const goalLabels: Record<DiagnosisGoal, string> = {
  email: "Email",
  upload: "Upload somewhere",
  whatsapp: "Share on WhatsApp",
  archive: "Archive",
  edit: "Edit",
  print: "Print",
  other: "Other",
}

const fileTypeLabels: Record<DiagnosisFileType, string> = {
  pdf: "PDF",
  image: "Image",
  json: "JSON",
  other: "Other",
}

const deviceLabels: Record<DiagnosisDevice, string> = {
  mac: "Mac",
  windows: "Windows",
  iphone: "iPhone",
  android: "Android",
  any: "Any device",
}

const quickPrompts = [
  {
    label: "PDF too large for email",
    update: {
      fileTypes: ["pdf"] as DiagnosisFileType[],
      problems: ["too-large"] as DiagnosisProblem[],
      goals: ["email"] as DiagnosisGoal[],
      device: "any" as DiagnosisDevice,
      freeText: "My PDF is too large for email attachments.",
    },
  },
  {
    label: "Scanned PDF I need to edit",
    update: {
      fileTypes: ["pdf"] as DiagnosisFileType[],
      problems: ["scanned-document", "cant-edit"] as DiagnosisProblem[],
      goals: ["edit"] as DiagnosisGoal[],
      device: "any" as DiagnosisDevice,
      freeText: "This scanned PDF needs to become editable.",
    },
  },
  {
    label: "Need to merge PDFs on Mac",
    update: {
      fileTypes: ["pdf"] as DiagnosisFileType[],
      problems: ["need-merge"] as DiagnosisProblem[],
      goals: [] as DiagnosisGoal[],
      device: "mac" as DiagnosisDevice,
      freeText: "I want to merge several PDFs on my Mac.",
    },
  },
  {
    label: "Password-protected PDF won't open",
    update: {
      fileTypes: ["pdf"] as DiagnosisFileType[],
      problems: ["wont-open", "password-protected"] as DiagnosisProblem[],
      goals: [] as DiagnosisGoal[],
      device: "any" as DiagnosisDevice,
      freeText: "The PDF is locked and will not open.",
    },
  },
]

function toggleValue<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

export function DiagnosisTool() {
  const searchParams = useSearchParams()
  const [inputs, setInputs] = useState<DiagnosisInputs>(EMPTY_DIAGNOSIS_INPUTS)
  const [results, setResults] = useState<Recommendation[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const initialInputs = getDiagnosisInitialInputs({
      fileType: searchParams.getAll("fileType"),
      problem: searchParams.getAll("problem"),
      device: searchParams.get("device") ?? undefined,
      goal: searchParams.getAll("goal"),
      q: searchParams.get("q") ?? undefined,
    })

    if (!hasDiagnosisPrefill(initialInputs)) return
    const initialResults = diagnose(initialInputs)
    setResults(initialResults)
    setInputs(initialInputs)
    setSubmitted(true)
  }, [searchParams])

  function runDiagnosis(nextInputs: DiagnosisInputs) {
    const nextResults = diagnose(nextInputs)
    setInputs(nextInputs)
    setResults(nextResults)
    setSubmitted(true)

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "diagnosis_run", {
        file_types: nextInputs.fileTypes.join(",") || "none",
        problems: nextInputs.problems.join(",") || "none",
        device: nextInputs.device,
        goals: nextInputs.goals.join(",") || "none",
        top_recommendation: nextResults[0]?.url ?? "none",
        recommendation_count: nextResults.length,
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    runDiagnosis(inputs)
  }

  function applyPrompt(update: DiagnosisInputs) {
    runDiagnosis(update)
  }

  function resetDiagnosis() {
    setInputs(EMPTY_DIAGNOSIS_INPUTS)
    setResults([])
    setSubmitted(false)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Step 1
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Describe the problem in plain language
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Choose the closest issue and goal, then add optional context in your own words. The
              diagnosis runs locally in your browser and only ranks routes. It does not upload your
              document or store the text you type.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDiagnosis}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:border-accent/40 hover:text-accent"
          >
            Reset
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Common issue shortcuts
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => applyPrompt(prompt.update)}
                className="rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground">File type</legend>
            <div className="flex flex-wrap gap-2">
              {FILE_TYPE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={inputs.fileTypes.includes(option)}
                    onChange={() =>
                      setInputs((current) => ({
                        ...current,
                        fileTypes: toggleValue(current.fileTypes, option),
                      }))
                    }
                  />
                  <span>{fileTypeLabels[option]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground">Main problem</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MAIN_PROBLEM_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-sm text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={inputs.problems.includes(option)}
                    onChange={() =>
                      setInputs((current) => ({
                        ...current,
                        problems: toggleValue(current.problems, option),
                      }))
                    }
                  />
                  <span>{problemLabels[option]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Device or OS</span>
              <select
                value={inputs.device}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    device: event.target.value as DiagnosisDevice,
                  }))
                }
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
              >
                {DEVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {deviceLabels[option]}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-foreground">Goal</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {GOAL_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-sm text-muted-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={inputs.goals.includes(option)}
                      onChange={() =>
                        setInputs((current) => ({
                          ...current,
                          goals: toggleValue(current.goals, option),
                        }))
                      }
                    />
                    <span>{goalLabels[option]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-foreground">
              Describe your issue in your own words
            </span>
            <textarea
              value={inputs.freeText}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  freeText: event.target.value,
                }))
              }
              rows={4}
              placeholder="Example: I have a scanned PDF that is too large for a job portal and I need to edit one page before uploading it."
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Diagnose the problem
            </button>
            <p className="text-sm text-muted-foreground">
              Privacy-first by default. The diagnosis logic runs locally and only recommends routes.
            </p>
          </div>
        </form>
      </section>

      {submitted ? (
        <section className="space-y-5">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                  Step 2
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  Recommended next routes
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  These are the best matches based on the issue, goal, device, and wording you gave
                  the tool. Start with the first route, review the output, then step back if the
                  result still needs another pass.
                </p>
              </div>
              <p className="text-sm font-medium text-foreground">
                {results.length} recommendation{results.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {results.map((recommendation) => (
              <DiagnosisResultCard key={recommendation.url} recommendation={recommendation} />
            ))}
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 text-sm text-muted-foreground shadow-[0_12px_40px_-28px_rgba(0,112,243,0.35)] md:p-6">
            <h3 className="text-base font-semibold text-foreground">Not quite right?</h3>
            <p className="mt-2 leading-relaxed">
              Add more detail, rerun the diagnosis, or jump to{" "}
              <Link href="/tools" className="font-medium text-accent hover:underline">
                the full tools directory
              </Link>
              . If the issue is unusual, read a related guide or use{" "}
              <Link href="/support" className="font-medium text-accent hover:underline">
                support
              </Link>
              .
            </p>
          </div>
        </section>
      ) : null}
    </div>
  )
}

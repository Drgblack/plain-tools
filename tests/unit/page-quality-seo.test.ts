import { describe, expect, it } from "vitest"

import { getComparisonPage } from "@/lib/compare-matrix"
import { buildProgrammaticPageData } from "@/lib/programmatic-content"
import { getToolPageProfile } from "@/lib/tool-page-content"
import { getToolBySlug } from "@/lib/tools-catalogue"

describe("priority page quality content", () => {
  it("provides differentiated core tool content for indexable tool pages", () => {
    const tool = getToolBySlug("merge-pdf")

    expect(tool).toBeTruthy()

    const profile = getToolPageProfile(tool!)

    expect(profile.overview.length).toBeGreaterThan(40)
    expect(profile.useCases.length).toBeGreaterThanOrEqual(3)
    expect(profile.answerFirst.bestFor).toBeTruthy()
    expect(profile.answerFirst.commonUseCases?.length ?? 0).toBeGreaterThanOrEqual(3)
    expect(profile.answerFirst.nextStep).toBeTruthy()
  })

  it("keeps comparison pages decision-oriented instead of generic", () => {
    const page = getComparisonPage("plain-tools-vs-smallpdf")

    expect(page).toBeTruthy()
    expect(page?.decisionChecklist.length).toBeGreaterThanOrEqual(4)
    expect(page?.sections.some((section) => section.title === "Who each tool is actually best for")).toBe(true)
    expect(page?.tool1BestFor.length ?? 0).toBeGreaterThan(20)
    expect(page?.tool2BestFor.length ?? 0).toBeGreaterThan(20)
  })

  it("keeps programmatic priority pages within the intended quality range", () => {
    const page = buildProgrammaticPageData("merge-pdf", "for-law-firms")

    expect(page).toBeTruthy()
    expect(page?.wordCount).toBeGreaterThanOrEqual(800)
    expect(page?.wordCount).toBeLessThanOrEqual(1500)
    expect(page?.faq.length).toBeGreaterThanOrEqual(5)
  })
})

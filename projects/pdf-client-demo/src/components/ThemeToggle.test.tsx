import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ThemeToggle } from "./ThemeToggle"

describe("ThemeToggle", () => {
  it("cycles theme mode and persists to localStorage", async () => {
    window.localStorage.clear()
    render(<ThemeToggle />)

    const button = screen.getByRole("button")

    await waitFor(() => {
      expect(button).toHaveAttribute("title", "Theme: System")
    })

    fireEvent.click(button)
    expect(window.localStorage.getItem("plain-tools-theme")).toBe("light")

    fireEvent.click(button)
    expect(window.localStorage.getItem("plain-tools-theme")).toBe("dark")

    fireEvent.click(button)
    expect(window.localStorage.getItem("plain-tools-theme")).toBe("system")
  })
})

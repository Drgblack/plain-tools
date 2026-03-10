"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

export function StatusLookupForm({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextValue = value.trim()
    if (!nextValue) return
    router.push(`/status/${encodeURIComponent(nextValue)}`)
  }

  return (
    <form className="space-y-3 notranslate" onSubmit={handleSubmit} translate="no">
      <label className="block text-sm font-medium text-foreground">
        Domain
        <input
          className="mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50"
          onChange={(event) => setValue(event.target.value)}
          placeholder="chatgpt.com"
          spellCheck={false}
          translate="no"
          type="text"
          value={value}
        />
      </label>
      <button
        className="w-full rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        type="submit"
      >
        Open canonical status page
      </button>
    </form>
  )
}

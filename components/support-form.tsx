"use client"

import { useCallback, useMemo, useState } from "react"
import { Loader2, Mail } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FormState = {
  name: string
  email: string
  message: string
  website: string
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  message: "",
  website: "",
}

export function SupportForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.message.trim().length > 0
    )
  }, [form.email, form.message, form.name, isSubmitting])

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!canSubmit) return

      setIsSubmitting(true)

      try {
        const response = await fetch("/api/support", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
            website: form.website,
          }),
        })

        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null

        if (!response.ok) {
          throw new Error(payload?.error || "Failed to send support email.")
        }

        toast.success("Email sent")
        setForm(INITIAL_STATE)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send support email."
        toast.error(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [canSubmit, form.email, form.message, form.name, form.website]
  )

  return (
    <div className="mt-8 rounded-xl border border-[#333] bg-[#111] p-5 md:p-6">
      <Toaster richColors position="top-right" />
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-4 w-4 text-[#0070f3]" />
        <h3 className="text-[15px] font-semibold text-white">Send Support Email</h3>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="support-name" className="text-white/70">
              Name
            </Label>
            <Input
              id="support-name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Your name"
              className="border-[#333] bg-[#0a0a0a] text-white placeholder:text-white/40"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="support-email" className="text-white/70">
              Email
            </Label>
            <Input
              id="support-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="you@example.com"
              className="border-[#333] bg-[#0a0a0a] text-white placeholder:text-white/40"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="support-message" className="text-white/70">
            Message
          </Label>
          <Textarea
            id="support-message"
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="How can we help?"
            rows={7}
            className="resize-y border-[#333] bg-[#0a0a0a] text-white placeholder:text-white/40"
            disabled={isSubmitting}
          />
        </div>

        <div
          aria-hidden="true"
          style={{ display: "none" }}
        >
          <Label htmlFor="support-website">Website</Label>
          <Input
            id="support-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) =>
              setForm((current) => ({ ...current, website: event.target.value }))
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Email"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

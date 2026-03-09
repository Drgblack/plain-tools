"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSampleIps } from "@/lib/network-utils"

type IPDynamicLookupClientProps = {
  ip: string
}

function normalizeIpInput(value: string) {
  return decodeURIComponent(value).trim().toLowerCase()
}

function validateClientIpAddress(value: string) {
  const normalized = normalizeIpInput(value)
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/
  const ipv6Pattern =
    /^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}$|^(?:[a-f0-9]{1,4}:){1,7}:$|^:(?::[a-f0-9]{1,4}){1,7}$|^(?:[a-f0-9]{1,4}:){1,6}:[a-f0-9]{1,4}$|^(?:[a-f0-9]{1,4}:){1,5}(?::[a-f0-9]{1,4}){1,2}$|^(?:[a-f0-9]{1,4}:){1,4}(?::[a-f0-9]{1,4}){1,3}$|^(?:[a-f0-9]{1,4}:){1,3}(?::[a-f0-9]{1,4}){1,4}$|^(?:[a-f0-9]{1,4}:){1,2}(?::[a-f0-9]{1,4}){1,5}$|^[a-f0-9]{1,4}:(?:(?::[a-f0-9]{1,4}){1,6})$|^::(?:ffff(?::0{1,4})?:)?(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$|^(?:[a-f0-9]{1,4}:){1,4}:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/

  return {
    isValid: ipv4Pattern.test(normalized) || ipv6Pattern.test(normalized),
    normalized,
  }
}

export function IPDynamicLookupClient({ ip }: IPDynamicLookupClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(ip)
  const validation = useMemo(() => validateClientIpAddress(value), [value])
  const quickChecks = getSampleIps(6)

  const handleLookup = () => {
    if (!validation.isValid) return
    startTransition(() => {
      router.push(`/ip/${encodeURIComponent(validation.normalized)}`)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="ip-lookup-input" className="mb-2 block text-sm text-muted-foreground">
          IP address
        </label>
        <Input
          id="ip-lookup-input"
          className="bg-secondary"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              handleLookup()
            }
          }}
          placeholder="8.8.8.8 or 2606:4700:4700::1111"
          value={value}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Enter any public IPv4 or IPv6 address to open the canonical lookup page.
        </p>
      </div>

      <Button
        className="w-full"
        disabled={!validation.isValid || isPending}
        onClick={handleLookup}
      >
        {isPending ? "Opening lookup..." : "Lookup IP address"}
      </Button>

      <div className="rounded-xl border border-border/70 bg-background/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Popular examples</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickChecks.map((sampleIp) => (
            <button
              key={sampleIp}
              type="button"
              onClick={() => setValue(sampleIp)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              {sampleIp}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Plain Tools does not ask for uploads or account data here. The lookup only requests public
        IP ownership metadata for the address you choose.
      </p>
    </div>
  )
}

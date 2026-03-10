"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

type NetworkLookupKind = "mx" | "ns" | "reverse" | "asn" | "whois"

const KIND_CONFIG: Record<
  NetworkLookupKind,
  {
    button: string
    label: string
    placeholder: string
    prefix: string
  }
> = {
  asn: {
    button: "Open ASN page",
    label: "ASN",
    placeholder: "AS15169",
    prefix: "/network/asn/",
  },
  mx: {
    button: "Open MX page",
    label: "Domain",
    placeholder: "google.com",
    prefix: "/network/mx/",
  },
  ns: {
    button: "Open NS page",
    label: "Domain",
    placeholder: "cloudflare.com",
    prefix: "/network/ns/",
  },
  reverse: {
    button: "Open reverse DNS page",
    label: "IP address",
    placeholder: "8.8.8.8",
    prefix: "/network/reverse/",
  },
  whois: {
    button: "Open WHOIS page",
    label: "Domain or IP",
    placeholder: "plain.tools",
    prefix: "/network/whois/",
  },
}

export function NetworkLookupForm({
  defaultValue,
  kind,
}: {
  defaultValue: string
  kind: NetworkLookupKind
}) {
  const router = useRouter()
  const config = KIND_CONFIG[kind]
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextValue = value.trim()
    if (!nextValue) return
    router.push(`${config.prefix}${encodeURIComponent(nextValue)}`)
  }

  return (
    <form className="space-y-3 notranslate" onSubmit={handleSubmit} translate="no">
      <label className="block text-sm font-medium text-foreground">
        {config.label}
        <input
          className="mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent/50"
          onChange={(event) => setValue(event.target.value)}
          placeholder={config.placeholder}
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
        {config.button}
      </button>
    </form>
  )
}

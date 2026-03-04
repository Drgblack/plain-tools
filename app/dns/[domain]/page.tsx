import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params:
    | {
        domain: string;
      }
    | Promise<{
        domain: string;
      }>;
};

function normalizeDomain(input: string) {
  const s = decodeURIComponent(input).trim().toLowerCase();
  if (!s.includes(".")) return `${s}.com`;
  return s;
}

function isValidDomain(input: string) {
  const value = input.trim().toLowerCase();
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(value);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await Promise.resolve(params);
  const normalized = normalizeDomain(domain);

  return {
    title: isValidDomain(normalized) ? `DNS Lookup for ${normalized}` : "Invalid Domain",
    description: isValidDomain(normalized)
      ? `DNS records and resolution details for ${normalized}.`
      : "The provided domain is not valid.",
  };
}

export default async function DNSDomainPage({ params }: Props) {
  const { domain } = await Promise.resolve(params);
  const normalized = normalizeDomain(domain);
  if (normalized !== domain) {
    redirect("/dns/" + encodeURIComponent(normalized));
  }

  if (!isValidDomain(normalized)) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Invalid domain</h1>
        <p className="mt-3 text-muted-foreground">
          We could not parse <code>{decodeURIComponent(domain)}</code> as a valid domain.
        </p>
        <Link className="mt-6 inline-flex text-accent hover:underline" href="/dns/google.com">
          Try /dns/google.com
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">DNS records for {normalized}</h1>
      <p className="mt-3 text-muted-foreground">
        Domain normalized and validated as <code>{normalized}</code>.
      </p>
    </main>
  );
}

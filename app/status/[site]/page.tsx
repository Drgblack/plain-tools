import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params:
    | {
        site: string;
      }
    | Promise<{
        site: string;
      }>;
};

function normalizeDomain(input: string) {
  const s = decodeURIComponent(input).trim().toLowerCase();
  if (!s.includes(".")) return `${s}.com`;
  return s;
}

function isValidSite(input: string) {
  const value = input.trim().toLowerCase();
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(value);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await Promise.resolve(params);
  const normalized = normalizeDomain(site);

  return {
    title: isValidSite(normalized) ? `Is ${normalized} Down?` : "Invalid Website",
    description: isValidSite(normalized)
      ? `Check whether ${normalized} is reachable right now.`
      : "The provided website is not valid.",
  };
}

export default async function SiteStatusDynamicPage({ params }: Props) {
  const { site } = await Promise.resolve(params);
  const normalized = normalizeDomain(site);
  if (normalized !== site) {
    redirect("/status/" + encodeURIComponent(normalized));
  }

  if (!isValidSite(normalized)) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Invalid website</h1>
        <p className="mt-3 text-muted-foreground">
          We could not parse <code>{decodeURIComponent(site)}</code> as a valid domain.
        </p>
        <Link className="mt-6 inline-flex text-accent hover:underline" href="/status/google.com">
          Try /status/google.com
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">Is {normalized} down?</h1>
      <p className="mt-3 text-muted-foreground">
        Domain normalized and validated as <code>{normalized}</code>.
      </p>
    </main>
  );
}

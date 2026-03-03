import "server-only"

import { clerkClient } from "@clerk/nextjs/server"

type PlanValue = "pro" | "free"

type PublicMetadataShape = {
  plan?: PlanValue
  stripeCustomerId?: string
  validUntil?: string
}

const getPublicMetadata = (value: unknown): PublicMetadataShape => {
  if (!value || typeof value !== "object") {
    return {}
  }

  const candidate = value as Record<string, unknown>
  return {
    plan: typeof candidate.plan === "string" ? (candidate.plan as PlanValue) : undefined,
    stripeCustomerId:
      typeof candidate.stripeCustomerId === "string" ? candidate.stripeCustomerId : undefined,
    validUntil: typeof candidate.validUntil === "string" ? candidate.validUntil : undefined,
  }
}

const hasValidProWindow = (validUntil?: string) => {
  if (!validUntil) return false
  const parsed = Date.parse(validUntil)
  return Number.isFinite(parsed) && parsed > Date.now()
}

export async function isPro(userId: string): Promise<boolean> {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const metadata = getPublicMetadata(user.publicMetadata)
  return metadata.plan === "pro" && hasValidProWindow(metadata.validUntil)
}

export async function setUserProSubscription(
  userId: string,
  values: {
    stripeCustomerId: string
    validUntil: string
  }
) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const current = getPublicMetadata(user.publicMetadata)

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      ...current,
      plan: "pro",
      stripeCustomerId: values.stripeCustomerId,
      validUntil: values.validUntil,
    },
  })
}

export async function clearUserProSubscription(
  userId: string,
  stripeCustomerId?: string
) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const current = getPublicMetadata(user.publicMetadata)

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      ...current,
      plan: "free",
      stripeCustomerId: stripeCustomerId || current.stripeCustomerId || "",
      validUntil: new Date(0).toISOString(),
    },
  })
}

export async function getStripeCustomerIdFromUser(userId: string): Promise<string | null> {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const metadata = getPublicMetadata(user.publicMetadata)
  return metadata.stripeCustomerId || null
}

export async function findUserIdByStripeCustomerId(
  stripeCustomerId: string
): Promise<string | null> {
  const client = await clerkClient()
  const pageSize = 100
  let offset = 0

  while (offset < 10_000) {
    const page = await client.users.getUserList({
      limit: pageSize,
      offset,
    })

    const users = Array.isArray((page as { data?: unknown }).data)
      ? ((page as { data: Array<{ id: string; publicMetadata?: unknown }> }).data ?? [])
      : []

    if (!users.length) {
      return null
    }

    const match = users.find((user) => {
      const metadata = getPublicMetadata(user.publicMetadata)
      return metadata.stripeCustomerId === stripeCustomerId
    })

    if (match) {
      return match.id
    }

    if (users.length < pageSize) {
      return null
    }

    offset += pageSize
  }

  return null
}

export async function getUserPrimaryEmail(userId: string): Promise<string | null> {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const primary = user.emailAddresses.find(
    (emailAddress) => emailAddress.id === user.primaryEmailAddressId
  )
  return primary?.emailAddress || user.emailAddresses[0]?.emailAddress || null
}


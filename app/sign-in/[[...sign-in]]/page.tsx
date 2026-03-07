import { SignIn } from "@clerk/nextjs"
import Link from "next/link"

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export default function SignInPage() {
  if (!clerkEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold">Sign in unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Clerk is not configured in this environment.
          </p>
          <Link href="/" className="mt-4 inline-flex text-sm text-primary underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
}

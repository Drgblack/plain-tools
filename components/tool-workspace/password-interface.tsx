"use client"

import { useState } from "react"
import { Lock, Unlock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolWorkspace } from "./index"

type DecryptStatus = "idle" | "decrypting" | "success" | "error"

interface PasswordInterfaceProps {
  fileName?: string
  mode?: "unlock" | "lock"
}

export function PasswordInterface({ 
  fileName = "encrypted-document.pdf",
  mode = "unlock"
}: PasswordInterfaceProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<DecryptStatus>("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSubmit = async () => {
    if (!password) return

    if (mode === "lock" && password !== confirmPassword) {
      setStatus("error")
      setStatusMessage("Passwords do not match")
      return
    }

    setStatus("decrypting")
    setStatusMessage(mode === "unlock" ? "Decrypting Locally..." : "Encrypting Locally...")

    // Simulate decryption process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate success (in real app, would validate password)
    if (password === "demo" || mode === "lock") {
      setStatus("success")
      setStatusMessage(mode === "unlock" ? "PDF unlocked successfully" : "PDF encrypted successfully")
    } else {
      setStatus("error")
      setStatusMessage("Incorrect password. Please try again.")
    }
  }

  const isUnlockMode = mode === "unlock"

  return (
    <ToolWorkspace 
      title={isUnlockMode ? "Unlock PDF" : "Encrypt PDF"} 
      fileName={fileName}
      privacyBannerText={isUnlockMode ? "Decrypting Locally" : "Encrypting Locally"}
    >
      <div className="flex-1 flex items-center justify-center p-8 bg-[oklch(0.11_0.005_250)]">
        <div className="w-full max-w-sm">
          {/* Status Icon */}
          <div className="mb-8 flex justify-center">
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 ${
              status === "success" 
                ? "bg-green-500/20 ring-2 ring-green-500/30" 
                : status === "error"
                ? "bg-destructive/20 ring-2 ring-destructive/30"
                : status === "decrypting"
                ? "bg-accent/20 ring-2 ring-accent/30"
                : "bg-white/[0.06] ring-2 ring-white/[0.08]"
            }`}>
              {status === "success" ? (
                <CheckCircle2 className="h-10 w-10 text-green-400" strokeWidth={1.5} />
              ) : status === "error" ? (
                <AlertCircle className="h-10 w-10 text-destructive" strokeWidth={1.5} />
              ) : status === "decrypting" ? (
                <Loader2 className="h-10 w-10 text-accent animate-spin" strokeWidth={1.5} />
              ) : isUnlockMode ? (
                <Lock className="h-10 w-10 text-accent/70" strokeWidth={1.5} />
              ) : (
                <Unlock className="h-10 w-10 text-accent/70" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-[18px] font-semibold text-foreground mb-2">
              {status === "success" 
                ? (isUnlockMode ? "PDF Unlocked" : "PDF Encrypted")
                : status === "decrypting"
                ? (isUnlockMode ? "Decrypting..." : "Encrypting...")
                : (isUnlockMode ? "This PDF is encrypted" : "Set PDF Password")
              }
            </h2>
            <p className="text-[13px] text-muted-foreground/70">
              {fileName}
            </p>
          </div>

          {/* Status Message */}
          {statusMessage && status !== "idle" && (
            <div className={`mb-6 flex items-center justify-center gap-2 rounded-lg px-4 py-3 ${
              status === "success" 
                ? "bg-green-500/10 text-green-400"
                : status === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-accent/10 text-accent"
            }`}>
              {status === "decrypting" && (
                <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
              )}
              <span className="text-[13px] font-medium">{statusMessage}</span>
            </div>
          )}

          {/* Password Form */}
          {status !== "success" && (
            <div className="space-y-4">
              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" strokeWidth={2} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder={isUnlockMode ? "Enter password" : "Create password"}
                  disabled={status === "decrypting"}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-3.5 pl-11 pr-12 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-accent/40 focus:bg-white/[0.05] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={2} />
                  )}
                </button>
              </div>

              {/* Confirm Password (Lock Mode Only) */}
              {!isUnlockMode && (
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" strokeWidth={2} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Confirm password"
                    disabled={status === "decrypting"}
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-3.5 pl-11 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-accent/40 focus:bg-white/[0.05] disabled:opacity-50"
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!password || status === "decrypting" || (!isUnlockMode && !confirmPassword)}
                className="w-full h-12 gap-2 bg-accent text-white hover:bg-accent-hover disabled:opacity-50"
              >
                {status === "decrypting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    {isUnlockMode ? "Decrypting..." : "Encrypting..."}
                  </>
                ) : (
                  <>
                    {isUnlockMode ? (
                      <Unlock className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Lock className="h-4 w-4" strokeWidth={2} />
                    )}
                    {isUnlockMode ? "Unlock PDF" : "Encrypt PDF"}
                  </>
                )}
              </Button>

              {/* Hint Text */}
              {isUnlockMode && status === "idle" && (
                <p className="text-[11px] text-muted-foreground/50 text-center">
                  Demo: Enter &ldquo;demo&rdquo; as password to unlock
                </p>
              )}
            </div>
          )}

          {/* Success Actions */}
          {status === "success" && (
            <div className="space-y-3">
              <Button className="w-full h-12 gap-2 bg-accent text-white hover:bg-accent-hover">
                Download {isUnlockMode ? "Unlocked" : "Encrypted"} PDF
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStatus("idle")
                  setStatusMessage("")
                  setPassword("")
                  setConfirmPassword("")
                }}
                className="w-full text-muted-foreground/70"
              >
                Process Another File
              </Button>
            </div>
          )}

          {/* Privacy Note */}
          <p className="mt-8 text-[11px] text-muted-foreground/50 text-center">
            {isUnlockMode 
              ? "Decryption happens entirely in your browser. Your password and file never leave your device."
              : "Encryption happens entirely in your browser using AES-256. Your file never leaves your device."
            }
          </p>
        </div>
      </div>
    </ToolWorkspace>
  )
}

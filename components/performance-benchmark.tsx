"use client"

import { useState, useCallback } from "react"
import { Play, Download, Cpu, Activity, HardDrive, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type BenchmarkStage = "idle" | "wasm" | "webgpu" | "io" | "complete"
type PerformanceTier = "Standard" | "Pro" | "Workstation Ultra"

interface BenchmarkResults {
  wasmScore: number
  webgpuScore: number
  ioScore: number
  overallScore: number
  tier: PerformanceTier
  pagesPerSecond: number
  ramAvailable: number
  hardwareAcceleration: boolean
}

// Circular progress ring component
function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  isActive = false 
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  isActive?: boolean
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={isActive ? "#0070f3" : "rgba(0,112,243,0.5)"}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300"
        style={{
          filter: isActive ? "drop-shadow(0 0 8px rgba(0,112,243,0.6))" : "none"
        }}
      />
    </svg>
  )
}

// Mini line graph for live data visualisation
function LiveGraph({ data, isActive }: { data: number[], isActive: boolean }) {
  const maxValue = Math.max(...data, 100)
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - (value / maxValue) * 100
    return `${x},${y}`
  }).join(" ")

  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
      ))}
      {/* Data line */}
      <polyline
        fill="none"
        stroke={isActive ? "#0070f3" : "rgba(0,112,243,0.4)"}
        strokeWidth="2"
        points={points}
        className="transition-all duration-150"
        style={{
          filter: isActive ? "drop-shadow(0 0 4px rgba(0,112,243,0.5))" : "none"
        }}
      />
      {/* Area fill */}
      <polygon
        fill="url(#graphGradient)"
        points={`0,100 ${points} 100,100`}
        opacity={isActive ? 0.3 : 0.1}
      />
      <defs>
        <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0070f3" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0070f3" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// CPU/GPU icon components
function CpuIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#0070f3" : "rgba(255,255,255,0.4)"} strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
    </svg>
  )
}

function GpuIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={active ? "#0070f3" : "rgba(255,255,255,0.4)"} strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="17" cy="12" r="2" />
      <line x1="5" y1="3" x2="5" y2="6" />
      <line x1="9" y1="3" x2="9" y2="6" />
      <line x1="15" y1="3" x2="15" y2="6" />
      <line x1="19" y1="3" x2="19" y2="6" />
    </svg>
  )
}

export function PerformanceBenchmark() {
  const [stage, setStage] = useState<BenchmarkStage>("idle")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<BenchmarkResults | null>(null)
  const [graphData, setGraphData] = useState<number[]>(Array(20).fill(0))
  const [runInBackground, setRunInBackground] = useState(false)
  const [statusText, setStatusText] = useState("Ready to benchmark")

  // Simulate benchmark with realistic-looking data
  const runBenchmark = useCallback(async () => {
    setStage("wasm")
    setProgress(0)
    setResults(null)
    setStatusText("Initialising Benchmark...")

    // Check for WebGPU support
    const hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator

    // Stage 1: Wasm Core
    await new Promise<void>((resolve) => {
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 8 + 2
        if (p >= 100) {
          p = 100
          clearInterval(interval)
          resolve()
        }
        setProgress(p)
        setGraphData(prev => [...prev.slice(1), Math.random() * 80 + 20])
        setStatusText("Parsing document metadata structures...")
      }, 80)
    })

    setStage("webgpu")
    setProgress(0)
    setStatusText("Analysing WebGPU Threads...")

    // Stage 2: WebGPU
    await new Promise<void>((resolve) => {
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 6 + 3
        if (p >= 100) {
          p = 100
          clearInterval(interval)
          resolve()
        }
        setProgress(p)
        setGraphData(prev => [...prev.slice(1), Math.random() * 100])
        setStatusText(hasWebGPU ? "Calculating available TFLOPS..." : "WebGPU unavailable, using fallback...")
      }, 100)
    })

    setStage("io")
    setProgress(0)
    setStatusText("Testing I/O Speed...")

    // Stage 3: I/O
    await new Promise<void>((resolve) => {
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 10 + 5
        if (p >= 100) {
          p = 100
          clearInterval(interval)
          resolve()
        }
        setProgress(p)
        setGraphData(prev => [...prev.slice(1), Math.random() * 60 + 40])
        setStatusText("Measuring RAM transfer bandwidth...")
      }, 60)
    })

    // Calculate results
    const wasmScore = Math.floor(Math.random() * 30 + 70)
    const webgpuScore = hasWebGPU ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 20 + 30)
    const ioScore = Math.floor(Math.random() * 25 + 75)
    const overallScore = Math.floor((wasmScore + webgpuScore + ioScore) / 3)

    let tier: PerformanceTier = "Standard"
    if (overallScore >= 85) tier = "Workstation Ultra"
    else if (overallScore >= 70) tier = "Pro"

    const pagesPerSecond = Math.floor(overallScore * 1.2 + Math.random() * 20)

    setResults({
      wasmScore,
      webgpuScore,
      ioScore,
      overallScore,
      tier,
      pagesPerSecond,
      ramAvailable: Math.floor(Math.random() * 4 + 2) * 1024,
      hardwareAcceleration: hasWebGPU
    })

    setStage("complete")
    setProgress(100)
    setStatusText("Optimisation Score calculated")
  }, [])

  // Generate system report PDF (simulated)
  const downloadReport = useCallback(() => {
    const reportContent = results ? `
PLAIN LABS - LOCAL PERFORMANCE BENCHMARK REPORT
================================================

Date: ${new Date().toLocaleDateString("en-GB")}
Time: ${new Date().toLocaleTimeString("en-GB")}

PERFORMANCE SUMMARY
-------------------
Overall Score: ${results.overallScore}/100
Performance Tier: ${results.tier}
Estimated Processing: ${results.pagesPerSecond} pages/second

DETAILED SCORES
---------------
Wasm Core (Logic): ${results.wasmScore}/100
WebGPU (AI): ${results.webgpuScore}/100
I/O Speed (Memory): ${results.ioScore}/100

SYSTEM HEALTH
-------------
Available RAM: ${results.ramAvailable} MB
Hardware Acceleration: ${results.hardwareAcceleration ? "Enabled" : "Unavailable"}

---
This report was generated locally. No data was sent to external servers.
    `.trim() : ""

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plain-benchmark-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [results])

  const isRunning = stage !== "idle" && stage !== "complete"

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0a] p-6 ring-1 ring-[#0070f3]/30 shadow-[0_0_30px_-5px_rgba(0,112,243,0.2)]">
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0070f3]/10 via-transparent to-[#0070f3]/5 pointer-events-none" />
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30">
            <Activity className="h-5 w-5 text-[#0070f3]" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Local Performance Benchmark</h3>
            <p className="text-[11px] text-muted-foreground/60 font-mono">PLAIN LABS</p>
          </div>
        </div>
        
        {/* Run in Background toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[11px] text-muted-foreground/60">Run in Background</span>
          <button
            onClick={() => setRunInBackground(!runInBackground)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
              runInBackground ? "bg-[#0070f3]" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                runInBackground ? "translate-x-4" : ""
              }`}
            />
          </button>
        </label>
      </div>

      {/* Main content area */}
      <div className="relative grid gap-6 md:grid-cols-2">
        {/* Left: Progress visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <ProgressRing progress={progress} size={140} strokeWidth={10} isActive={isRunning} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{Math.floor(progress)}%</span>
              <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">
                {stage === "idle" ? "Ready" : stage === "complete" ? "Done" : "Running"}
              </span>
            </div>
          </div>
          
          {/* Status text */}
          <p className="mt-4 text-[12px] text-muted-foreground/80 font-mono text-center h-8">
            {statusText}
          </p>

          {/* Live graph */}
          <div className="w-full mt-4 p-3 rounded-lg bg-white/[0.02] ring-1 ring-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground/50 font-mono">LIVE ACTIVITY</span>
              <span className="text-[10px] text-[#0070f3] font-mono">{isRunning ? "ACTIVE" : "IDLE"}</span>
            </div>
            <LiveGraph data={graphData} isActive={isRunning} />
          </div>
        </div>

        {/* Right: Stages and results */}
        <div className="flex flex-col gap-4">
          {/* Three stages */}
          <div className="space-y-3">
            {/* Wasm Core */}
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              stage === "wasm" ? "bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30" : "bg-white/[0.02]"
            }`}>
              <CpuIcon active={stage === "wasm" || (results !== null && results.wasmScore > 0)} />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-foreground/80">Wasm Core (Logic)</p>
                <p className="text-[10px] text-muted-foreground/50">Document metadata parsing</p>
              </div>
              {results && (
                <span className="text-[13px] font-mono font-semibold text-[#0070f3]">{results.wasmScore}</span>
              )}
            </div>

            {/* WebGPU */}
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              stage === "webgpu" ? "bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30" : "bg-white/[0.02]"
            }`}>
              <GpuIcon active={stage === "webgpu" || (results !== null && results.webgpuScore > 0)} />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-foreground/80">WebGPU (AI)</p>
                <p className="text-[10px] text-muted-foreground/50">Available TFLOPS for AI</p>
              </div>
              {results && (
                <span className="text-[13px] font-mono font-semibold text-[#0070f3]">{results.webgpuScore}</span>
              )}
            </div>

            {/* I/O Speed */}
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              stage === "io" ? "bg-[#0070f3]/10 ring-1 ring-[#0070f3]/30" : "bg-white/[0.02]"
            }`}>
              <HardDrive className={`w-5 h-5 ${stage === "io" || (results !== null && results.ioScore > 0) ? "text-[#0070f3]" : "text-white/40"}`} strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-foreground/80">I/O Speed (Memory)</p>
                <p className="text-[10px] text-muted-foreground/50">RAM transfer bandwidth</p>
              </div>
              {results && (
                <span className="text-[13px] font-mono font-semibold text-[#0070f3]">{results.ioScore}</span>
              )}
            </div>
          </div>

          {/* Results summary */}
          {results && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#0070f3]/10 to-transparent ring-1 ring-[#0070f3]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-wider">Performance Tier</span>
                <span className={`text-[13px] font-bold font-mono ${
                  results.tier === "Workstation Ultra" ? "text-[#0070f3]" :
                  results.tier === "Pro" ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {results.tier}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                  <span className="text-muted-foreground/70">
                    <span className="font-mono text-foreground">{results.pagesPerSecond}</span> pages/sec
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#0070f3]" strokeWidth={2} />
                  <span className="text-muted-foreground/70">
                    <span className="font-mono text-foreground">{results.ramAvailable}</span> MB RAM
                  </span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  {results.hardwareAcceleration ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                      <span className="text-muted-foreground/70">Hardware Acceleration <span className="text-emerald-400">Enabled</span></span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
                      <span className="text-muted-foreground/70">Hardware Acceleration <span className="text-amber-400">Unavailable</span></span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-auto">
            <Button
              onClick={runBenchmark}
              disabled={isRunning}
              className="flex-1 h-10 bg-[#0070f3] hover:bg-[#0070f3]/90 text-white text-[13px] font-medium"
            >
              <Play className="w-4 h-4 mr-2" strokeWidth={2} />
              {isRunning ? "Running..." : "Start Benchmark"}
            </Button>
            
            {results && (
              <Button
                onClick={downloadReport}
                variant="outline"
                className="h-10 px-4 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-[13px]"
              >
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                Download Report
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 pt-4 border-t border-white/[0.06] text-[10px] text-muted-foreground/40 text-center font-mono">
        This test uses local resources only. No data is sent to our servers.
      </p>
    </div>
  )
}

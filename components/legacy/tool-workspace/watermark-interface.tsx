"use client"

import { useState } from "react"
import { Download, RotateCcw, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ToolWorkspace } from "./index"

interface WatermarkInterfaceProps {
  fileName?: string
}

export function WatermarkInterface({ fileName = "document.pdf" }: WatermarkInterfaceProps) {
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [opacity, setOpacity] = useState([40])
  const [rotation, setRotation] = useState([45])
  const [isTiled, setIsTiled] = useState(false)
  const [fontSize, setFontSize] = useState([48])
  const [colour, setColour] = useState("#6385ff")

  return (
    <ToolWorkspace 
      title="Add Watermark" 
      fileName={fileName}
      privacyBannerText="Applied Locally"
    >
      <div className="flex h-full">
        {/* Sidebar - Controls */}
        <aside className="w-80 border-r border-white/[0.06] bg-[oklch(0.125_0.006_250)] flex flex-col overflow-y-auto">
          <div className="p-5 space-y-6">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground mb-4">Watermark Settings</h3>
              
              {/* Text Input */}
              <div className="space-y-2 mb-5">
                <Label htmlFor="watermark-text" className="text-[12px] text-muted-foreground/80">
                  Watermark Text
                </Label>
                <input
                  id="watermark-text"
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-accent/40 focus:bg-white/[0.05]"
                />
              </div>

              {/* Opacity Slider */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-muted-foreground/80">Opacity</Label>
                  <span className="text-[12px] font-medium text-foreground">{opacity[0]}%</span>
                </div>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-muted-foreground/80">Rotation</Label>
                  <span className="text-[12px] font-medium text-foreground">{rotation[0]}°</span>
                </div>
                <Slider
                  value={rotation}
                  onValueChange={setRotation}
                  min={-90}
                  max={90}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-center gap-2 mt-2">
                  {[-45, 0, 45].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotation([angle])}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                        rotation[0] === angle
                          ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                          : "bg-white/[0.04] text-muted-foreground/70 hover:bg-white/[0.08]"
                      }`}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Slider */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-muted-foreground/80">Font Size</Label>
                  <span className="text-[12px] font-medium text-foreground">{fontSize[0]}px</span>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={120}
                  step={4}
                  className="w-full"
                />
              </div>

              {/* Colour Picker */}
              <div className="space-y-2 mb-5">
                <Label className="text-[12px] text-muted-foreground/80">Colour</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="h-10 w-10 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[12px] font-mono text-foreground outline-none focus:border-accent/40"
                  />
                </div>
              </div>

              {/* Tiled Toggle */}
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Grid3X3 className="h-4 w-4 text-accent/70" strokeWidth={2} />
                  <div>
                    <Label className="text-[13px] font-medium text-foreground">Tiled Pattern</Label>
                    <p className="text-[11px] text-muted-foreground/60">Repeat watermark across page</p>
                  </div>
                </div>
                <Switch
                  checked={isTiled}
                  onCheckedChange={setIsTiled}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto p-5 border-t border-white/[0.06]">
            <Button
              className="w-full gap-2 bg-accent text-white hover:bg-accent-hover mb-2"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Apply & Download
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setWatermarkText("CONFIDENTIAL")
                setOpacity([40])
                setRotation([45])
                setIsTiled(false)
                setFontSize([48])
                setColour("#6385ff")
              }}
              className="w-full gap-2 text-muted-foreground/70"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
              Reset to Defaults
            </Button>
          </div>
        </aside>

        {/* Document Preview */}
        <div className="flex-1 overflow-auto p-8 bg-[oklch(0.10_0.004_250)]">
          <div className="mx-auto max-w-2xl">
            <div
              className="relative bg-white rounded-lg shadow-2xl aspect-[8.5/11] overflow-hidden"
              style={{ minHeight: 600 }}
            >
              {/* Simulated PDF Content */}
              <div className="absolute inset-0 p-8">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-3/4 bg-gray-100 rounded" />
                </div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
                <div className="space-y-2 mb-6">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-5/6 bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                </div>
              </div>

              {/* Watermark Overlay */}
              {watermarkText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  {isTiled ? (
                    // Tiled pattern
                    <div 
                      className="absolute inset-0 flex flex-wrap justify-center items-center gap-16"
                      style={{
                        transform: `rotate(${rotation[0]}deg)`,
                        opacity: opacity[0] / 100,
                      }}
                    >
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span
                          key={i}
                          className="whitespace-nowrap font-bold"
                          style={{
                            fontSize: `${fontSize[0] * 0.6}px`,
                            color: colour,
                          }}
                        >
                          {watermarkText}
                        </span>
                      ))}
                    </div>
                  ) : (
                    // Single watermark
                    <span
                      className="whitespace-nowrap font-bold"
                      style={{
                        fontSize: `${fontSize[0]}px`,
                        color: colour,
                        opacity: opacity[0] / 100,
                        transform: `rotate(${rotation[0]}deg)`,
                      }}
                    >
                      {watermarkText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  )
}

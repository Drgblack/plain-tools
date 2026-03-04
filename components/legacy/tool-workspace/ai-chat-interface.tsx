"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Cpu, Sparkles, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolWorkspace } from "./index"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatInterfaceProps {
  fileName?: string
}

export function AIChatInterface({ fileName = "document.pdf" }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I've loaded your document. Ask me anything about its contents - I can summarise sections, extract key points, or answer specific questions. All processing happens locally in your browser.",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const totalPages = 5

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))

    const responses: Record<string, string> = {
      summary: "Based on my analysis, this document contains 3 main sections:\n\n1. **Executive Summary** - An overview of key findings and recommendations\n2. **Detailed Analysis** - In-depth examination of the data with supporting charts\n3. **Conclusions** - Final recommendations and next steps\n\nWould you like me to elaborate on any specific section?",
      default: "I've analysed the relevant sections of your document. The content discusses various aspects related to your query. The key points include proper documentation procedures, compliance requirements, and recommended best practices.\n\nIs there a specific part you'd like me to focus on?",
    }

    const responseContent = inputValue.toLowerCase().includes("summar") 
      ? responses.summary 
      : responses.default

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsProcessing(false)
  }

  return (
    <ToolWorkspace 
      title="AI Chat with PDF" 
      fileName={fileName}
      privacyBannerText="Local AI via WebGPU"
    >
      {/* Local AI Banner */}
      <div className="flex items-center justify-center gap-2 border-b border-accent/20 bg-accent/[0.08] px-4 py-2">
        <Cpu className="h-4 w-4 text-accent" strokeWidth={2} />
        <span className="text-[12px] font-medium text-accent">
          Local AI: Your data never leaves this browser. Processing via WebGPU.
        </span>
      </div>

      <div className="flex h-[calc(100%-40px)]">
        {/* PDF Preview - Left Side */}
        <div className="w-1/2 border-r border-white/[0.06] flex flex-col bg-[oklch(0.10_0.004_250)]">
          {/* PDF Toolbar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[oklch(0.12_0.005_250)] px-4 py-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 text-muted-foreground/70 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </Button>
              <span className="text-[12px] text-muted-foreground/70 min-w-[80px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="h-8 w-8 p-0 text-muted-foreground/70 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                className="h-8 w-8 p-0 text-muted-foreground/70"
              >
                <ZoomOut className="h-4 w-4" strokeWidth={2} />
              </Button>
              <span className="text-[11px] text-muted-foreground/60 min-w-[40px] text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(z => Math.min(200, z + 10))}
                className="h-8 w-8 p-0 text-muted-foreground/70"
              >
                <ZoomIn className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 overflow-auto p-6">
            <div 
              className="mx-auto bg-white rounded-lg shadow-xl aspect-[8.5/11] overflow-hidden"
              style={{ 
                maxWidth: `${Math.min(500, 400 * zoom / 100)}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center"
              }}
            >
              {/* Simulated PDF Content */}
              <div className="p-8">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="text-[10px] text-gray-400 mb-4">Page {currentPage}</div>
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
                </div>
                <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface - Right Side */}
        <div className="w-1/2 flex flex-col bg-[oklch(0.125_0.006_250)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-accent text-white"
                      : "bg-white/[0.05] text-foreground/90"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-3 w-3 text-accent" strokeWidth={2} />
                      <span className="text-[10px] font-medium text-accent">Local AI</span>
                    </div>
                  )}
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="block mt-2 text-[10px] opacity-50">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/[0.05] rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground/60">Processing locally...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask about this document..."
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-accent/40 focus:bg-white/[0.05]"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isProcessing}
                className="h-auto px-4 bg-accent text-white hover:bg-accent-hover disabled:opacity-50"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground/50 text-center">
              Powered by WebLLM - all processing happens in your browser
            </p>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  )
}

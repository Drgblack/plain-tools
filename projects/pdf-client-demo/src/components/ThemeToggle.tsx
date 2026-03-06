import { useTheme } from "../hooks/useTheme"

const MODE_LABEL: Record<"light" | "dark" | "system", string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

const nextMode = (mode: "light" | "dark" | "system"): "light" | "dark" | "system" => {
  if (mode === "light") return "dark"
  if (mode === "dark") return "system"
  return "light"
}

export function ThemeToggle() {
  const { mode, resolvedTheme, setMode } = useTheme()

  const icon = resolvedTheme === "dark" ? "☾" : "☀"

  return (
    <button
      type="button"
      onClick={() => setMode(nextMode(mode))}
      aria-label={`Theme: ${MODE_LABEL[mode]}. Activate to switch theme mode.`}
      className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
      title={`Theme: ${MODE_LABEL[mode]}`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {icon}
      </span>
      <span className="hidden sm:inline">{MODE_LABEL[mode]}</span>
    </button>
  )
}

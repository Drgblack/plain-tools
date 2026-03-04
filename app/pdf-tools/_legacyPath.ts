export function legacyPath(path: string) {
  if (!path.startsWith("/")) path = "/" + path
  return "/pdf-tools" + (path === "/" ? "" : path)
}

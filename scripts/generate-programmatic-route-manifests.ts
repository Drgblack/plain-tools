import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import { getFileConverterManifest } from "../lib/file-converter-slugs"
import { getPdfComparisonManifest } from "../lib/pdf-tool-comparisons"

async function main() {
  const outputDir = path.join(process.cwd(), "generated", "route-manifests")
  await mkdir(outputDir, { recursive: true })

  const fileConverters = getFileConverterManifest()
  const pdfComparisons = getPdfComparisonManifest()

  await writeFile(
    path.join(outputDir, "file-converters.json"),
    `${JSON.stringify(fileConverters, null, 2)}\n`,
    "utf8"
  )

  await writeFile(
    path.join(outputDir, "pdf-comparisons.json"),
    `${JSON.stringify(pdfComparisons, null, 2)}\n`,
    "utf8"
  )

  console.log(`Generated ${fileConverters.length} converter routes and ${pdfComparisons.length} PDF comparison routes.`)
  console.log(`Wrote manifests to ${outputDir}`)
}

void main()

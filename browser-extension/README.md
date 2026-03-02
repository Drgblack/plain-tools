# Plain Browser Extension

A minimal browser extension for quick access to Plain's offline PDF tools.

## Features

- Quick launcher for all Plain tools
- Opens tools in new tabs
- Zero permissions required
- Matches Plain website styling

## Installation

### Chrome / Edge / Brave

1. Download or clone this `browser-extension` folder
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `browser-extension` folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file

## Icons

Before publishing, add icon files to the `icons/` folder:
- `icon-16.png` (16x16)
- `icon-32.png` (32x32)
- `icon-48.png` (48x48)
- `icon-128.png` (128x128)

Use the Plain LogoMark (P with blue dot) at each size.

## Tools Included

- **Merge PDF** - Combine multiple PDFs
- **Split PDF** - Separate pages
- **Extract Pages** - Pull specific pages
- **Reorder Pages** - Rearrange page order
- **Compress PDF** - Reduce file size

## Privacy & Permissions

**This extension does not process PDFs.**
All tools run on plain.tools in your browser.

### Permissions

| Permission | Status | Purpose |
|------------|--------|---------|
| File system access | None | - |
| Active tab access | None | - |
| Background network requests | None | - |
| Analytics | None | - |
| Open tabs | Implicit | Opens plain.tools in new tabs |
| Storage | Optional | Reserved for future settings |

### What this extension does NOT do

- Does not read files
- Does not upload documents
- Does not track usage

---

## Store Listing Copy

**Short Description:**
Quick launcher for Plain.tools. This extension does NOT process PDFs — all tools run on plain.tools in your browser.

**Detailed Description:**

Plain is a browser extension that provides quick access to offline PDF tools.

**Important:** This extension does not process PDFs. It simply opens Plain.tools pages where all PDF processing happens locally in your browser using WebAssembly.

**What you can do:**
- Merge multiple PDFs into one
- Split PDFs into separate files
- Extract specific pages
- Reorder pages
- Compress PDF files

**Privacy commitment:**
- No file system access
- No active tab access
- No background network requests
- No analytics or tracking
- No data collection

All PDF processing happens entirely in your browser on plain.tools. Your files never leave your device.

# Tomorrowland Timetable Generator

A Chrome extension for the [Tomorrowland Line-up / Timetable page](https://belgium.tomorrowland.com/en/line-up/?day=2026-07-17&page=timetable).

Bookmark the set boxes you want to see, hide or fade the rest, and **export your personal schedule as a high‑resolution PNG or PDF** — including phone‑ratio versions designed to be used as an iPhone lock‑screen wallpaper.

It reads the live timetable directly (Planby / Shadow‑aware) and saves your selections in `localStorage`, so they persist across reloads and when you switch between days and weekends.

---

## Features

- ⭐ **Bookmark acts** — a gold star on every set tile adds it to your schedule.
- 🌓 **Hide or fade** the unselected acts (two modes: 15% fade, or fully hidden).
- 🖼️ **Export your schedule** to PNG or PDF in three layouts:
  - **Stage columns** *(default)* — vertical, each stage is a column, time runs top → bottom.
  - **Agenda** — a vertical list, one act per row.
  - **Stage grid** — horizontal, stages stacked as rows, time runs left → right.
- 📱 **Lock‑screen sizes** — render at exact iPhone / square ratios with:
  - a top safe‑area so the header clears the Dynamic Island / clock (separate **iOS 27** and **iOS 26** presets),
  - a bottom safe‑area that clears the home indicator and lock‑screen app row,
  - a darkened wallpaper background and a feathered **Consciencia** graphic,
  - neon edge‑glow on the text, and a distinct color per stage.
- 📅 **Per‑day export** — only the acts for the day you're currently viewing are included.
- 🔍 **4K‑class resolution** and automatic text‑resizing so names never clip.

---

## Install (Chrome — Developer Mode)

This extension is not on the Chrome Web Store; you load it locally as an "unpacked" extension.

1. **Download the code.**
   - Either clone the repo:
     ```bash
     git clone https://github.com/qdnguyen0/tml-timetable-generator.git
     ```
   - …or download the ZIP from GitHub (**Code → Download ZIP**) and unzip it.
2. Open Google Chrome and go to **`chrome://extensions`**.
3. Turn on **Developer mode** (toggle in the top‑right corner).
4. Click **Load unpacked** (top‑left).
5. Select the project folder (the one containing **`manifest.json`**).
6. The extension is now installed. Open the
   [Tomorrowland Timetable](https://belgium.tomorrowland.com/en/line-up/?day=2026-07-17&page=timetable)
   and you'll see the **TML Timetable** control panel slide in at the bottom‑right.

> **After editing any file** (or pulling an update), return to `chrome://extensions` and click the **↻ reload** icon on the extension's card, then hard‑refresh the timetable page (**⇧⌘R / Ctrl‑Shift‑R**). A normal page refresh alone does **not** reload the extension's code.

### Updating

```bash
git pull
```
Then reload the extension at `chrome://extensions` and hard‑refresh the page.

---

## Usage

1. **Bookmark your sets.** Click the gold **★** in the top‑right corner of any performance tile. Click again to remove it. The panel shows your selected‑act count.
2. **Filter the grid.** Open the panel (bottom‑right) and toggle **Hide Unselected**, then choose:
   - **Fade (15% opacity)** — dims the rest but keeps the grid visible.
   - **Hide Completely** — shows only your picks.
3. **Export your schedule.** Click **Export Schedule (PNG / PDF)** and pick:
   - **Layout:** Stage columns *(default)* · Agenda · Stage grid.
   - **Size:** iPhone (iOS 27) *(default)* · iPhone (iOS 26 — extra top room for the larger clock) · Fit content · Square. *(Size applies to the vertical layouts; the horizontal grid always exports at "fit content".)*
   - **Format:** Download **PNG** or **PDF**.
   The file downloads as `tomorrowland-<day>-<layout>[-<size>].png|pdf`.
4. **Clear selections.** The small **clear all** link at the bottom of the panel removes every bookmark (with a confirmation).

### Notes

- **Day filtering:** the export only includes acts for the day in the page URL (`?day=YYYY‑MM‑DD`). Switch days using the page's own day picker, then export each day separately.
- **Capture as you browse:** act details (name, stage, time) are captured the moment a tile is rendered, so the export works even for acts that have scrolled out of view — just make sure you've seen/bookmarked them.

---

## Tampermonkey (alternative)

If you'd rather not load an extension, the same tool is available as a userscript: create a new script in [Tampermonkey](https://www.tampermonkey.net/) and paste the contents of [`tml-timetable-filter.user.js`](tml-timetable-filter.user.js).

---

## Project structure

| File | Purpose |
|---|---|
| `manifest.json` | Chrome MV3 manifest (registers the content scripts). |
| `content.js` | Main logic: panel UI, bookmarking, filtering, and the PNG/PDF schedule renderer. Runs in the isolated content‑script world. |
| `fiber-bridge.js` | Runs in the page's MAIN world to read each tile's data from React and stamp it onto the DOM as `data-*` attributes (the isolated content script can't see React internals directly). |
| `tml-timetable-filter.user.js` | Stand‑alone Tampermonkey build (mirror of `content.js`). |
| `icon.png` | Extension icon. |

---

## How it works (short version)

The timetable is a `<tml-live-lineup>` web component that renders the Planby EPG into the page. Each act's data (`id`, `title`, `stage`, `since`, `till`) lives in the React fiber attached to its tile. Because Chrome content scripts run in an **isolated world** and can't read React's fiber expandos, a small **MAIN‑world bridge** (`fiber-bridge.js`) reads them and writes the data to `data-tml-*` attributes. `content.js` then reads those attributes to power bookmarking and to rebuild a clean, high‑resolution schedule image for export.

---

## Disclaimer

This is an unofficial, personal tool and is not affiliated with or endorsed by Tomorrowland. It only reads publicly available line‑up data already shown on the page.

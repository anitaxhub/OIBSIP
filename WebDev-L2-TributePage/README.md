# Ada Lovelace | A Tribute Page

**Oasis Infobyte Internship (OIBSIP) | Web Development | Level 1, Task 2**
**Intern:** Anita Bashir

A responsive tribute page dedicated to **Ada Lovelace** (1815-1852), the English mathematician who wrote the first published algorithm for Charles Babbage's Analytical Engine and imagined that computers could work with far more than numbers. Built with HTML5 and CSS3 (no JavaScript).

## Why Ada Lovelace?
As a computer science student, I admire her because she looked at an early machine and saw the ideas behind modern programming, more than a century before the first computers were built.

## Objective
Design and build a visually engaging tribute page dedicated to a historical figure, scientist, artist or public figure.

## Features (Task Checklist)
- [x] Page title with the subject's name and a one-line tagline
- [x] A prominent royalty-free image (Wikimedia Commons, public domain)
- [x] Biography section with 4 paragraphs of original written content
- [x] Timeline of key moments (an ordered list styled as cards)
- [x] A distinctly styled quote block
- [x] 4 different background colours across sections (navy, parchment, mist blue, brass)
- [x] 2 font styles: Fraunces (serif) for headings and quote, Work Sans (sans-serif) for body text
- [x] Responsive layout, tested down to 390 px width

## Tech Stack
- HTML5 (semantic tags: `header`, `main`, `section`, `figure`, `ol`, `blockquote`, `footer`)
- CSS3 (custom properties, Flexbox, CSS columns, media queries)
- Google Fonts: Fraunces and Work Sans

## Colour Palette
| Name | Hex | Used for |
|------|-----|----------|
| Midnight | `#111a33` | Hero and footer |
| Parchment | `#f7f0e1` | Biography section |
| Mist | `#e8edf6` | Timeline section |
| Brass | `#c9a24a` / `#d8b25a` | Accents and quote section |

## Design Notes
- A thin strip of small gaps under the hero is a nod to the punched cards that the Analytical Engine was designed to read.
- The biography uses a drop cap and two text columns on larger screens, and one column on mobile.

## Project Structure
```
WebDev-L1-TributePage/
├── index.html
├── style.css
├── README.md
├── images/
│   └── ada-lovelace.jpg
└── screenshots/
    ├── desktop-full.png
    └── mobile-full.png
```

## How to Run
1. Download or clone the repository.
2. Open `WebDev-L1-TributePage/index.html` in any modern browser.

No installation or build step is needed.

## Screenshots
| Desktop | Mobile |
|---------|--------|
| ![Desktop view](screenshots/desktop-full.png) | ![Mobile view](screenshots/mobile-full.png) |

## Research and Credits
- Facts were researched from Encyclopaedia Britannica and Wikipedia. All text on the page is written in my own words.
- Portrait: _file name and artist_ via Wikimedia Commons (public domain).
- Quote: Ada Lovelace, Notes on Menabrea's memoir, 1843 (public domain).

## What I Learned
- Planning a page around sections with distinct backgrounds and one consistent palette
- Pairing a serif heading font with a sans-serif body font
- Styling an ordered list as a timeline with CSS
- Using CSS columns and `::first-letter` for an editorial look

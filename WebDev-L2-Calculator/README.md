# Calculator

**Oasis Infobyte Internship (OIBSIP) | Web Development | Level 2, Task 1**
**Intern:** Anita Bashir

A fully functional browser-based calculator with a button interface, built with HTML5, CSS3 (Grid) and vanilla JavaScript. It does not use `eval()`: all calculations are handled with variables and a `switch` statement.

## Objective
Build a browser-based calculator that performs basic arithmetic operations with a user-friendly button interface.

## Features (Task Checklist)
- [x] Display screen showing the current input and the result (plus a smaller line with the running expression)
- [x] Numeric buttons 0 to 9 and a decimal point button
- [x] Operator buttons: addition, subtraction, multiplication, division
- [x] Equals (=) button to evaluate
- [x] Clear (C) button to reset the display
- [x] Backspace button to remove the last entered character
- [x] Division by zero shows an error message instead of crashing
- [x] Operator chaining (e.g. 5 + 3 x 2) without needing a full reset
- [x] CSS Grid used for the button layout
- [x] Event listeners on every button (no inline `onclick` in the HTML)

### Extra touches
- Keyboard support: digits, `+ - * /`, `Enter`, `Backspace`, `Esc`
- The operator that is waiting for its second number is highlighted
- Floating point noise is rounded away (0.1 + 0.2 shows 0.3)
- Very large or very small results switch to scientific notation
- The number on the display shrinks so it never overflows
- Only one decimal point is allowed per number
- Pressing two operators in a row replaces the first one
- Responsive down to 390 px width

## How Operator Chaining Works
Like a standard pocket calculator, operations are evaluated **from left to right** as soon as the next operator is pressed.

Example: `5 + 3 x 2`
1. `5 + 3` then pressing `x` shows **8** (the pending result)
2. `8 x 2` then pressing `=` gives **16**

## Tech Stack
- HTML5
- CSS3 (Grid, custom properties)
- JavaScript (vanilla)
- Google Fonts: JetBrains Mono and Manrope

## Project Structure
```
WebDev-L2-Calculator/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    ├── result-desktop.png
    ├── chaining-desktop.png
    ├── division-by-zero.png
    └── result-mobile.png
```

## How to Run
1. Download or clone the repository.
2. Open `WebDev-L2-Calculator/index.html` in any modern browser.

No installation or build step is needed.

## Screenshots
| Result | Operator chaining |
|--------|-------------------|
| ![Result](screenshots/result-desktop.png) | ![Chaining](screenshots/chaining-desktop.png) |

| Division by zero | Mobile |
|------------------|--------|
| ![Division by zero](screenshots/division-by-zero.png) | ![Mobile](screenshots/result-mobile.png) |

## Test Cases I Checked
- 5 + 3 x 2 = 16 (chained left to right)
- 0.1 + 0.2 = 0.3
- 8 / 0 shows "Cannot divide by zero", and the next key press recovers
- 100 / 8 = 12.5
- 5 - 8 = -3
- Typing 1.2.3 only keeps one decimal point (1.23)
- Backspace removes one digit at a time and returns to 0

## What I Learned
- Managing calculator state with a few variables (current input, previous value, operator)
- Using a `switch` statement instead of `eval()` for safe calculations
- Building a keypad with CSS Grid, including buttons that span rows and columns
- Handling edge cases: division by zero, floating point rounding, repeated operators

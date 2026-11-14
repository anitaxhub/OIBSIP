# Temperature Converter

**Oasis Infobyte Internship (OIBSIP) | Web Development | Task 3**
**Intern:** Anita Bashir

An interactive temperature converter that converts between **Celsius, Fahrenheit and Kelvin**. It validates input as the user types, shows all three results at once, and handles temperatures below absolute zero with a friendly message. Built with HTML5, CSS3 and vanilla JavaScript.

## Objective
Build an interactive web tool that converts temperature values between Celsius, Fahrenheit and optionally Kelvin, with real-time input validation.

## Features (Task Checklist)
- [x] Numeric input field that rejects non-numeric text with an error message
- [x] Input unit selector using radio buttons (Celsius / Fahrenheit / Kelvin)
- [x] All three output units shown at the same time
- [x] Convert button that runs the calculation on click (the Enter key works too)
- [x] Result area with correct unit labels (°C, °F, K), and the input unit is marked
- [x] Edge case handling: values below absolute zero show a clear message
- [x] Clean, centred layout with clear labels

### Extra touches
- Live validation while typing
- Changing the input unit re-checks the value and refreshes the results
- Rounds to 2 decimal places and removes trailing zeros (25.00 becomes 25)
- Rejects extremely large numbers
- Accessible markup: labels, `fieldset`/`legend`, `aria-live` results and `aria-invalid` on errors
- Responsive down to 390 px width

## Tech Stack
- HTML5
- CSS3 (custom properties, Flexbox, Grid)
- JavaScript (vanilla, no libraries)
- Google Fonts: Bricolage Grotesque and DM Sans

## Conversion Formulas
| Conversion | Formula |
|------------|---------|
| Celsius to Fahrenheit | F = C x 9/5 + 32 |
| Fahrenheit to Celsius | C = (F - 32) x 5/9 |
| Celsius to Kelvin | K = C + 273.15 |
| Kelvin to Celsius | C = K - 273.15 |

Internally every value is first converted to Kelvin, then to the other units. This keeps the code short and makes the absolute zero check simple (Kelvin must be 0 or higher).

## Validation Rules
| Input | Result |
|-------|--------|
| Empty | "Please enter a temperature value." |
| Letters or symbols (e.g. `abc`, `12abc`) | "Numbers only, please." |
| Below absolute zero (-273.15 C, -459.67 F, 0 K) | Friendly message, no result |
| Valid number (e.g. `25`, `-3.5`, `.5`) | All three conversions displayed |

## Project Structure
```
WebDev-L1-TemperatureConverter/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    ├── result-desktop.png
    ├── result-mobile.png
    ├── error-non-numeric.png
    └── error-below-absolute-zero.png
```

## How to Run
1. Download or clone the repository.
2. Open `WebDev-L1-TemperatureConverter/index.html` in any modern browser.

No installation or build step is needed.

## Screenshots
| Result (desktop) | Result (mobile) |
|------------------|-----------------|
| ![Result on desktop](screenshots/result-desktop.png) | ![Result on mobile](screenshots/result-mobile.png) |

| Non-numeric input | Below absolute zero |
|-------------------|---------------------|
| ![Non-numeric error](screenshots/error-non-numeric.png) | ![Absolute zero error](screenshots/error-below-absolute-zero.png) |

## Test Cases I Checked
- 25 C = 77 F = 298.15 K
- 100 C = 212 F = 373.15 K
- 32 F = 0 C = 273.15 K
- -40 C = -40 F
- 0 K = -273.15 C = -459.67 F
- -273.15 C is accepted, -273.16 C is rejected
- `abc`, `12abc` and an empty field show an error

## What I Learned
- Validating user input with a regular expression instead of trusting `type="number"`
- Handling edge cases and floating point rounding in JavaScript
- Updating the DOM and ARIA attributes from events
- Styling radio buttons as a segmented control

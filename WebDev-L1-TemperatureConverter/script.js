"use strict";

/* ---------- DOM references ---------- */
const form        = document.getElementById("converter-form");
const input       = document.getElementById("temp-input");
const errorBox    = document.getElementById("input-error");
const hint        = document.getElementById("results-hint");
const resultList  = document.getElementById("result-list");
const unitRadios  = document.querySelectorAll('input[name="unit"]');

const outputs = {
  C: document.getElementById("out-c"),
  F: document.getElementById("out-f"),
  K: document.getElementById("out-k"),
};

const SYMBOLS = { C: "\u00B0C", F: "\u00B0F", K: "K" };
const MAX_ABS_VALUE = 1e12;

/* ---------- Conversion helpers ---------- */
function toKelvin(value, unit) {
  if (unit === "C") return value + 273.15;
  if (unit === "F") return (value - 32) * 5 / 9 + 273.15;
  return value;
}

function fromKelvin(kelvin, unit) {
  if (unit === "C") return kelvin - 273.15;
  if (unit === "F") return (kelvin - 273.15) * 9 / 5 + 32;
  return kelvin;
}

function formatNumber(number) {
  // Round to 2 decimals and drop trailing zeros (25.00 -> 25).
  // parseFloat also turns "-0.00" into 0, so we never show "-0".
  return parseFloat(number.toFixed(2)).toString();
}

function getSelectedUnit() {
  return document.querySelector('input[name="unit"]:checked').value;
}

/* ---------- Validation ---------- */
// Returns { value } when the text is a valid number, otherwise { error }.
function parseInput(rawText) {
  const text = rawText.trim().replace("\u2212", "-");   // allow the typographic minus sign

  if (text === "") {
    return { error: "Please enter a temperature value." };
  }
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(text)) {
    return { error: "Numbers only, please. Try something like 25 or -3.5." };
  }

  const value = Number(text);
  if (Math.abs(value) > MAX_ABS_VALUE) {
    return { error: "That number is too large. Please enter a smaller value." };
  }
  return { value };
}

// Full check: format first, then the absolute zero edge case.
function validate(rawText, unit) {
  const parsed = parseInput(rawText);
  if (parsed.error) return parsed;

  const kelvin = toKelvin(parsed.value, unit);
  if (kelvin < -1e-9) {                                  // tiny tolerance for floating point
    return {
      error: "That is below absolute zero (\u2212273.15 \u00B0C, \u2212459.67 \u00B0F or 0 K). Nothing can be colder, so please enter a higher value."
    };
  }
  return { value: parsed.value, kelvin };
}

/* ---------- UI helpers ---------- */
function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  input.setAttribute("aria-invalid", "true");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
  input.setAttribute("aria-invalid", "false");
}

function hideResults() {
  resultList.hidden = true;
  hint.hidden = false;
}

function showResults(kelvin, inputUnit) {
  ["C", "F", "K"].forEach(function (unit) {
    const converted = fromKelvin(kelvin, unit);
    outputs[unit].textContent = formatNumber(converted) + " " + SYMBOLS[unit];
    resultList.querySelector('[data-unit="' + unit + '"]')
      .classList.toggle("is-input", unit === inputUnit);
  });
  hint.hidden = true;
  resultList.hidden = false;
}

/* ---------- Events ---------- */
// Real-time validation while typing (stays quiet while the field is empty).
input.addEventListener("input", function () {
  if (input.value.trim() === "") {
    clearError();
    hideResults();
    return;
  }
  const result = validate(input.value, getSelectedUnit());
  if (result.error) {
    showError(result.error);
    hideResults();
  } else {
    clearError();
  }
});

// Changing the input unit re-checks the value, and refreshes results if they are showing.
unitRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    if (input.value.trim() === "") return;

    const unit = getSelectedUnit();
    const result = validate(input.value, unit);
    if (result.error) {
      showError(result.error);
      hideResults();
    } else {
      clearError();
      if (!resultList.hidden) showResults(result.kelvin, unit);
    }
  });
});

// Convert button (also works with the Enter key).
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const unit = getSelectedUnit();
  const result = validate(input.value, unit);

  if (result.error) {
    showError(result.error);
    hideResults();
    input.focus();
    return;
  }

  clearError();
  showResults(result.kelvin, unit);
});

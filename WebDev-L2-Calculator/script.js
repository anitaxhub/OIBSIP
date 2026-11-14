"use strict";

/* ---------- DOM references ---------- */
const expressionEl = document.getElementById("expression");
const currentEl    = document.getElementById("current");

const digitButtons    = document.querySelectorAll("[data-digit]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons   = document.querySelectorAll("[data-action]");

/* ---------- Calculator state ---------- */
let currentInput   = "0";     // what the user is typing / the latest result (as text)
let previousValue  = null;    // the first number waiting for an operation (number)
let operator       = null;    // "+", "-", "*" or "/"
let shouldReset    = false;   // true when the next digit should start a fresh number
let hasError       = false;   // true after a division by zero

const MAX_DIGITS = 15;
const SYMBOLS = { "+": "+", "-": "\u2212", "*": "\u00D7", "/": "\u00F7" };

/* ---------- Core calculation (no eval) ---------- */
function calculate(a, op, b) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) return null;      // division by zero is handled by the caller
      return a / b;
    default:
      return b;
  }
}

// Rounds away floating point noise (0.1 + 0.2 -> 0.3) and handles very big / small numbers.
function formatNumber(value) {
  const rounded = Number(value.toPrecision(12));
  const size = Math.abs(rounded);
  if (rounded !== 0 && (size >= 1e15 || size < 1e-9)) {
    return Number(rounded.toExponential(11)).toExponential();
  }
  return String(rounded);
}

/* ---------- Display ---------- */
function updateDisplay() {
  currentEl.textContent = currentInput;

  currentEl.classList.toggle("is-error", hasError);
  currentEl.classList.toggle("is-medium", !hasError && currentInput.length > 9 && currentInput.length <= 13);
  currentEl.classList.toggle("is-small", !hasError && currentInput.length > 13);

  // highlight the operator that is waiting for its second number
  operatorButtons.forEach(function (button) {
    const isWaiting = operator === button.dataset.operator && shouldReset && !hasError;
    button.classList.toggle("is-active", isWaiting);
  });
}

function setExpression(text) {
  expressionEl.textContent = text;
}

/* ---------- Actions ---------- */
function clearAll() {
  currentInput  = "0";
  previousValue = null;
  operator      = null;
  shouldReset   = false;
  hasError      = false;
  setExpression("");
  updateDisplay();
}

function showDivisionError() {
  hasError      = true;
  currentInput  = "Cannot divide by zero";
  previousValue = null;
  operator      = null;
  shouldReset   = true;
  setExpression("");
  updateDisplay();
}

function inputDigit(digit) {
  if (hasError) clearAll();

  if (shouldReset) {
    // a result is on screen (or an operator was just pressed): start a new number
    if (operator === null) setExpression("");
    currentInput = digit;
    shouldReset  = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput.replace(/[-.]/g, "").length < MAX_DIGITS) {
    currentInput += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (hasError) clearAll();

  if (shouldReset) {
    if (operator === null) setExpression("");
    currentInput = "0.";
    shouldReset  = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (hasError) return;

  if (operator !== null && shouldReset) {
    // two operators in a row: just swap the operator
    operator = nextOperator;
    setExpression(formatNumber(previousValue) + " " + SYMBOLS[operator]);
    updateDisplay();
    return;
  }

  if (operator !== null) {
    // operator chaining: finish the pending operation first (5 + 3 x ... -> 8 x ...)
    const result = calculate(previousValue, operator, parseFloat(currentInput));
    if (result === null) {
      showDivisionError();
      return;
    }
    previousValue = result;
    currentInput  = formatNumber(result);
  } else {
    previousValue = parseFloat(currentInput);
  }

  operator    = nextOperator;
  shouldReset = true;
  setExpression(formatNumber(previousValue) + " " + SYMBOLS[operator]);
  updateDisplay();
}

function evaluate() {
  if (hasError || operator === null) return;

  const secondNumber = parseFloat(currentInput);
  const result = calculate(previousValue, operator, secondNumber);

  if (result === null) {
    showDivisionError();
    return;
  }

  setExpression(formatNumber(previousValue) + " " + SYMBOLS[operator] + " " + formatNumber(secondNumber) + " =");
  currentInput  = formatNumber(result);
  previousValue = null;
  operator      = null;
  shouldReset   = true;
  updateDisplay();
}

function backspace() {
  if (hasError) {
    clearAll();
    return;
  }
  if (shouldReset) return;                // nothing typed yet, so nothing to delete

  const onlyOneDigitLeft = currentInput.length === 1 ||
                           (currentInput.length === 2 && currentInput.startsWith("-"));
  currentInput = onlyOneDigitLeft ? "0" : currentInput.slice(0, -1);
  updateDisplay();
}

/* ---------- Event listeners (one for every button, no inline onclick) ---------- */
digitButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    inputDigit(button.dataset.digit);
  });
});

operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    chooseOperator(button.dataset.operator);
  });
});

actionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    switch (button.dataset.action) {
      case "clear":     clearAll();     break;
      case "backspace": backspace();    break;
      case "decimal":   inputDecimal(); break;
      case "equals":    evaluate();     break;
    }
  });
});

/* ---------- Keyboard support ---------- */
const keyMap = {
  "Enter": '[data-action="equals"]',
  "=": '[data-action="equals"]',
  "Backspace": '[data-action="backspace"]',
  "Escape": '[data-action="clear"]',
  "c": '[data-action="clear"]',
  "C": '[data-action="clear"]',
  ".": '[data-action="decimal"]',
  ",": '[data-action="decimal"]',
  "+": '[data-operator="+"]',
  "-": '[data-operator="-"]',
  "*": '[data-operator="*"]',
  "x": '[data-operator="*"]',
  "/": '[data-operator="/"]',
};

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  let selector = null;
  if (event.key >= "0" && event.key <= "9" && event.key.length === 1) {
    selector = '[data-digit="' + event.key + '"]';
  } else if (keyMap[event.key]) {
    selector = keyMap[event.key];
  }
  if (!selector) return;

  event.preventDefault();                 // stops Enter / "/" from triggering other browser actions
  const button = document.querySelector(selector);
  button.click();
  button.classList.add("is-pressed");
  setTimeout(function () { button.classList.remove("is-pressed"); }, 120);
});

updateDisplay();

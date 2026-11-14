# Daily To-Do Web App

**Oasis Infobyte Internship (OIBSIP) | Web Development | Level 2, Task 3**
**Intern:** Anita Bashir

An interactive to-do list that helps manage daily tasks. Tasks can be added, completed, edited and deleted, and they are organised into **Pending** and **Completed** lists. Everything is saved in the browser with `localStorage`. Built with HTML5, CSS3 and vanilla JavaScript.

## Objective
Develop an interactive to-do list application that allows users to manage daily tasks with add, complete, edit and delete functionality, organised into pending and completed lists.

## Features (Task Checklist)
- [x] Input field and "Add Task" button to create new tasks
- [x] New tasks appear immediately in the **Pending Tasks** list
- [x] "Mark Complete" toggle on every task: completed tasks move to the **Completed Tasks** list (and can be moved back)
- [x] Edit button that changes the task text inline (Enter saves, Esc cancels)
- [x] Delete button that permanently removes a task from either list
- [x] Task count indicators above each list ("X pending" and "Y completed")
- [x] (Bonus) Timestamp on each task showing when it was added and when it was completed
- [x] (Bonus) Tasks persist across page refreshes using `localStorage`
- [x] Friendly empty state message when a list has no items

### Extra touches
- Validation: empty or space-only tasks are rejected with a message (when adding and when editing)
- Task text is limited to 120 characters and extra spaces are cleaned up
- Newest pending tasks appear on top; the most recently finished task appears first in Completed
- User text is inserted with `textContent`, so HTML typed into a task is shown as plain text and never runs
- Keyboard friendly and screen reader friendly (labels, `aria-live` counters, visible focus styles)
- Responsive: two columns on desktop, one column on mobile

## Tech Stack
- HTML5
- CSS3 (Grid, Flexbox, custom properties)
- JavaScript (vanilla, no libraries)
- Google Fonts: Outfit and Nunito Sans

## How It Works
Every task is an object:
```js
{ id, text, completed, createdAt, completedAt }
```
All tasks live in one array. After every change (add, toggle, edit, delete) the app saves the array to `localStorage` and calls a single `render()` function, which rebuilds both lists and updates the counters and empty states. Keeping one source of truth makes the logic simple and avoids the lists getting out of sync.

## Project Structure
```
WebDev-L2-ToDoApp/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/
    ├── empty-state.png
    ├── tasks-desktop.png
    ├── editing-validation.png
    └── mobile-full.png
```

## How to Run
1. Download or clone the repository.
2. Open `WebDev-L2-ToDoApp/index.html` in any modern browser.

No installation or build step is needed.

## Screenshots
| Tasks | Empty state |
|-------|-------------|
| ![Tasks](screenshots/tasks-desktop.png) | ![Empty state](screenshots/empty-state.png) |

| Inline edit with validation | Mobile |
|-----------------------------|--------|
| ![Editing](screenshots/editing-validation.png) | ![Mobile](screenshots/mobile-full.png) |

## Test Cases I Checked
- Adding an empty or space-only task shows an error and adds nothing
- A new task appears in Pending and the counter updates
- Ticking a task moves it to Completed, adds a completed time, and unticking moves it back
- Inline edit saves with Enter, cancels with Esc, and rejects empty text
- Delete works from both lists, and the empty state appears when a list becomes empty
- Tasks are still there after refreshing the page
- Typing `<b>bold</b>` shows the text literally

## What I Learned
- Manipulating the DOM safely with `createElement` and `textContent`
- Keeping app state in one array and re-rendering from it
- Saving and loading data with `localStorage` and handling errors with `try/catch`
- Building an inline edit mode with keyboard shortcuts

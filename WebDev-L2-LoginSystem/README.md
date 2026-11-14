# Keystone | Login Authentication System

**Oasis Infobyte Internship (OIBSIP) | Web Development | Task 4**
**Intern:** Anita Bashir

A client-side authentication system with **user registration, login validation and a protected dashboard**. It uses **Approach A (front-end only): HTML5, CSS3 and vanilla JavaScript with `localStorage`**. No frameworks or libraries are used.

## Objective
Build a simple client-side (or full-stack) authentication system featuring user registration, login validation and access to a protected page.

## Features (Task Checklist)
- [x] **Registration page** with username, email and password fields and a "Register" button
- [x] **Password validation:** minimum 8 characters and at least 1 number (live checklist while typing)
- [x] **Duplicate check:** an error is shown if the username or email already exists (not case sensitive)
- [x] **Login page** with username/email and password fields and a "Login" button
- [x] **Incorrect credentials:** one clear message, "Incorrect username/email or password.", that never reveals which field was wrong
- [x] **Protected page:** the dashboard is only visible to logged-in users, others are redirected to the login page

### Extra touches
- Passwords are **salted and hashed** (PBKDF2 with SHA-256, 150,000 rounds, using the browser's Web Crypto API). Plain text passwords are never saved
- Users can log in with either their username or their email
- Logout button that clears the session and locks the dashboard again
- "Keep me signed in on this device" option (session in `localStorage`), otherwise the session ends when the tab closes (`sessionStorage`)
- Short lock (30 seconds) after 5 wrong login attempts
- The password is hashed even when the username does not exist, so response time does not reveal which usernames are real
- Show/Hide password buttons, confirm password field, and field-level error messages
- Logged-in users who open the login or register page are sent straight to the dashboard
- User text is shown with `textContent`, so it can never run as HTML
- Responsive layout, tested down to 390 px width

## Tech Stack
- HTML5
- CSS3 (Grid, Flexbox, custom properties)
- JavaScript (vanilla) with `localStorage`, `sessionStorage` and the Web Crypto API
- Google Fonts: Sora and Plus Jakarta Sans

## How It Works
| Part | What happens |
|------|--------------|
| Register | Fields are validated, duplicates are checked, then a random salt is generated and the password is hashed. Only the salt and hash are saved in `localStorage` |
| Login | The typed password is hashed with the saved salt and compared with the saved hash. On success a session is created |
| Session | Stored in `sessionStorage` (or `localStorage` if "Keep me signed in" is ticked) |
| Protected page | `dashboard.js` checks for a valid session before showing anything. No session means a redirect to `index.html` |
| Logout | Removes the session and returns to the login page |

## Important Note
This project is a **front-end demo**. All data lives in the visitor's own browser, so it demonstrates how authentication works but cannot replace a real server-side system. In a real application, accounts, password hashing and sessions must be handled on a secure back end (for example Node.js + Express with a database), and the protected content itself must be served only after the server verifies the user.

## Project Structure
```
WebDev-L2-LoginSystem/
├── index.html        (login page)
├── register.html     (registration page)
├── dashboard.html    (protected page)
├── style.css
├── auth.js           (registration, login, sessions, validation)
├── login.js
├── register.js
├── dashboard.js
├── README.md
└── screenshots/
```

## How to Run
1. Download or clone the repository.
2. Open `WebDev-L2-LoginSystem/index.html` in a modern browser (Chrome, Edge or Firefox).
3. Click "Create an account", register, then log in.

Password hashing needs a secure context, which means `file://`, `localhost` or `https://` all work. No installation or build step is needed.

## Screenshots
| Login | Login error |
|-------|-------------|
| ![Login](screenshots/login-desktop.png) | ![Login error](screenshots/login-error.png) |

| Password rules | Duplicate error |
|----------------|-----------------|
| ![Password rules](screenshots/register-password-rules.png) | ![Duplicate](screenshots/register-duplicate-error.png) |

| Dashboard | Mobile |
|-----------|--------|
| ![Dashboard](screenshots/dashboard-desktop.png) | ![Mobile](screenshots/register-mobile.png) |

## Test Cases I Checked
- Opening `dashboard.html` without logging in redirects to the login page with a message
- Empty form, invalid email, short password and password without a number all show errors
- Mismatched confirm password shows an error
- Registering the same username or email again (any capitalisation) shows a duplicate error
- Wrong password and unknown username show the exact same message
- After 5 wrong attempts the form locks for 30 seconds, even for the correct password
- Login works with username or email, and the dashboard shows the right details
- The session survives a refresh, and logout locks the dashboard again
- The saved data in `localStorage` contains only a salt and hash, never the password

## What I Learned
- How registration, login and sessions fit together
- Why passwords must be salted and hashed, and how to do it with the Web Crypto API
- Protecting a page with a session check and redirects
- Writing error messages that help the user without leaking information

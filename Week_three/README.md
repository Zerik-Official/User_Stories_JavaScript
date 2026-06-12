# Week 3 - DOM Manipulation & Local Storage (M3S3)

## Objective
Create a mini notes app that allows adding and removing DOM elements and persists data using Local Storage.

## Concepts Reinforced
- DOM selection (`getElementById`, `querySelector`)
- Creating and inserting elements (`appendChild`, `removeChild`)
- Modifying content with `textContent`
- Event handling (click, keydown)
- Local Storage persistence (`setItem`, `getItem`)
- Array management with push/splice

## Files
| File | Description |
|------|-------------|
| `index.html` | Main page with notes app interface and TextTarea console panel |
| `manipulacion_dom.js` | Core logic: add/delete notes, localStorage persistence, DOM manipulation |
| `style.css` | Additional background and list styling |

## How to Run
Open `index.html` in any modern browser. Type a note and click **Add** or press Enter. Click **Delete** to remove a note.

## Tasks Completed
1. HTML structure with input, button, and list
2. DOM element selection and logging
3. Adding notes with validation, creating li elements with delete buttons
4. Removing notes from DOM and array
5. Local Storage save/load with full persistence across reloads

## Acceptance Criteria
- [x] Add/remove elements using DOM API (`appendChild`, `removeChild`)
- [x] Uses at least two selection methods (`getElementById`)
- [x] Modifies content with `textContent`
- [x] Local Storage persists notes across reloads
- [x] All actions logged to console
- [x] Code uses `let`/`const`

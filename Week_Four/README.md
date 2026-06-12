# Week 4 - Full Stack App with API (M3S4)

## Objective
Design and implement a complete web application integrating core JavaScript concepts: DOM manipulation, Local Storage persistence, and Fetch API communication.

## Concepts Reinforced
- Variables (`let`/`const`) and data structures (objects, arrays)
- User interaction via DOM forms
- Advanced DOM manipulation (create, modify, delete elements)
- Local Storage for persistence
- Fetch API with CRUD operations (GET, POST, PUT, DELETE)
- `async/await` and `try...catch` error handling
- Data validation

## Files
| File | Description |
|------|-------------|
| `index.html` | Main page with product form, list, sync button, and console panel |
| `app.js` | Core logic: CRUD operations, localStorage, Fetch API integration |
| `style.css` | Additional background and input styling |

## How to Run
Requires the Vite dev server and JSON Server:

```bash
# Terminal 1 - start the dev server
npm run dev

# Terminal 2 - start JSON Server
npm run api
```

Then open `http://localhost:5173` and navigate to Week 4 (or go directly to `http://localhost:5173/Week_Four/`).

## Tasks Completed
1. HTML structure with form, list, and sync button
2. User input via DOM form with validation
3. Dynamic DOM manipulation (add, edit, delete product elements)
4. Local Storage persistence
5. Fetch API integration: GET on page load, POST on sync
6. Complete error handling with console.error

## Acceptance Criteria
- [x] Uses ES6+ JavaScript with `let`/`const`
- [x] Integrates DOM, Local Storage, and Fetch API
- [x] Input validation and error handling
- [x] CRUD operations work correctly with the API
- [x] Code organized and readable
- [x] Console logs for all operations

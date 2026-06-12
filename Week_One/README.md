# Week 1 - Interactive Message System (M3S1)

## Objective
Implement an interactive JavaScript program that interacts with the user by requesting their name and age, validating the input, and displaying dynamic messages based on the conditions.

## Concepts Reinforced
- Variable declaration (`let`, `const`)
- Data types in JavaScript
- `console.log()`, `alert()`, `prompt()`, `console.error()`
- Conditionals (`if`, `else if`, `else`)
- Best practices (camelCase, descriptive naming)

## Files
| File | Description |
|------|-------------|
| `index.html` | Main page with Tailwind CSS styling and the shared TextTarea component |
| `sistema_interactivo.js` | Core logic: prompts for name and age, validates, outputs personalized messages |
| `style.css` | Additional background styling |

## How to Run
Open `index.html` in any modern browser and click the **Start** button.

## Tasks Completed
1. Project setup with separate HTML, JS, CSS files
2. User input via overridden prompt dialogs
3. Age validation (numeric check with error output)
4. Conditional messages for minors vs adults

## Acceptance Criteria
- [x] File named `sistema_interactivo.js`
- [x] Uses `let` and `const` (no `var`)
- [x] Validates age is a valid number
- [x] Personalized messages based on age
- [x] `console.error()` for input errors
- [x] Code structured and readable

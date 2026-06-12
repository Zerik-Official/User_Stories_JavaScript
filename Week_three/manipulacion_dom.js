/** @type {HTMLInputElement} */
const input = document.getElementById('note-input');
/** @type {HTMLButtonElement} */
const addBtn = document.getElementById('add-btn');
/** @type {HTMLUListElement} */
const list = document.getElementById('note-list');

console.log('Input element:', input);
console.log('Add button:', addBtn);
console.log('List element:', list);

/** @type {string[]} */
let notes = [];

/**
 * Load notes from Local Storage and render them into the DOM.
 * Called once on page load.
 */
function loadNotes() {
  const stored = localStorage.getItem('notes');
  if (stored) {
    notes = JSON.parse(stored);
    console.log(`Loaded ${notes.length} notes from Local Storage.`);
    notes.forEach(text => addNoteToDOM(text));
  }
}

/** Persist the current notes array to Local Storage. */
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
  console.log('Notes saved to Local Storage.');
}

/**
 * Create and append a list item element for a note.
 * @param {string} text - The note content.
 */
function addNoteToDOM(text) {
  const li = document.createElement('li');
  li.className = 'flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors';

  const span = document.createElement('span');
  span.textContent = text;
  span.className = 'text-gray-200 text-sm break-all flex-1 mr-4';

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.className = 'shrink-0 px-3 py-1 text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400';

  delBtn.addEventListener('click', function() {
    const index = Array.from(list.children).indexOf(li);
    if (index !== -1) {
      list.removeChild(li);
      notes.splice(index, 1);
      saveNotes();
      console.log(`Deleted note: "${text}"`);
    }
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}

/** Read input, validate, add note to DOM and storage, then clear input. */
function addNote() {
  const text = input.value.trim();
  if (text === '') {
    console.warn('Cannot add an empty note.');
    input.focus();
    return;
  }

  addNoteToDOM(text);
  notes.push(text);
  saveNotes();
  console.log(`Added note: "${text}"`);

  input.value = '';
  input.focus();
}

addBtn.addEventListener('click', addNote);
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addNote();
});

loadNotes();

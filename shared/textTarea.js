/**
 * TextTarea - A shared UI component that captures console output, prompt, and alert
 * calls and displays them in a styled panel using the DOM.
 */
class TextTarea {
  /**
   * @param {string} containerId - The ID of the container element to render into.
   */
  constructor(containerId = 'output') {
    /** @type {Array<{type: string, text: string, timestamp: string}>} */
    this.entries = [];
    this.maxEntries = 200;
    this.container = document.getElementById(containerId);
    this._createUI();
    this._overrideConsole();
    this._overrideDialogs();
    window.__textTarea = this;
  }

  /** Build the output panel UI inside the container element. */
  _createUI() {
    this.container.innerHTML = `
      <div class="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-circle text-red-500 text-[0.5rem]"></i>
            <i class="fa-solid fa-circle text-yellow-500 text-[0.5rem]"></i>
            <i class="fa-solid fa-circle text-green-500 text-[0.5rem]"></i>
            <span class="ml-2 text-gray-300 text-sm font-semibold tracking-wide">CONSOLE</span>
          </div>
          <div class="flex items-center gap-3">
            <span id="entry-count" class="text-xs text-gray-500">0 entries</span>
            <button id="clear-output" class="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
              <i class="fa-solid fa-eraser mr-1"></i>Clear
            </button>
          </div>
        </div>
        <div id="output-content" class="p-4 max-h-96 overflow-y-auto space-y-1 font-mono text-sm leading-relaxed"></div>
      </div>
    `;

    this.content = this.container.querySelector('#output-content');
    this.countEl = this.container.querySelector('#entry-count');
    this.container.querySelector('#clear-output').onclick = () => this.clear();
  }

  /** Override global console.log, console.warn, console.error to capture output. */
  _overrideConsole() {
    const self = this;
    ['log', 'warn', 'error'].forEach(method => {
      const original = console[method];
      console[method] = function(...args) {
        self._addEntry(method, args);
        original.apply(console, args);
      };
    });
  }

  /** Override window.prompt and window.alert with modal-based async versions. */
  _overrideDialogs() {
    const self = this;
    window._origPrompt = window.prompt;
    window._origAlert = window.alert;
    window.prompt = function(msg, _default) {
      return self._showPrompt(msg, _default);
    };
    window.alert = function(msg) {
      return self._showAlert(msg);
    };
  }

  /**
   * Format and store a new console entry, then re-render.
   * @param {string} type - One of 'log', 'warn', 'error'.
   * @param {Array} args - Arguments passed to the console method.
   */
  _addEntry(type, args) {
    const text = args.map(a => {
      if (a === null) return 'null';
      if (a === undefined) return 'undefined';
      if (typeof a === 'object') {
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }
      return String(a);
    }).join(' ');

    const timestamp = new Date().toLocaleTimeString();
    this.entries.push({ type, text, timestamp });
    if (this.entries.length > this.maxEntries) this.entries.shift();
    this._render();
  }

  /** Rebuild the output content from stored entries and auto-scroll. */
  _render() {
    this.content.innerHTML = this.entries.map(e => {
      const config = {
        log: { color: 'text-emerald-400', icon: 'fa-solid fa-chevron-right', bg: 'hover:bg-gray-800' },
        warn: { color: 'text-amber-400', icon: 'fa-solid fa-triangle-exclamation', bg: 'hover:bg-gray-800' },
        error: { color: 'text-red-400', icon: 'fa-solid fa-circle-xmark', bg: 'hover:bg-gray-800' }
      };
      const c = config[e.type] || config.log;
      const displayText = e.text.length > 800 ? e.text.slice(0, 800) + '...' : e.text;
      return `<div class="flex gap-2 ${c.bg} px-2 py-1 rounded ${c.color} fade-in">
        <span class="opacity-60 shrink-0 w-4 text-center"><i class="${c.icon}"></i></span>
        <span class="whitespace-pre-wrap break-all">${this._escape(displayText)}</span>
        <span class="text-gray-600 text-xs ml-auto shrink-0">${e.timestamp}</span>
      </div>`;
    }).join('');
    this.content.scrollTop = this.content.scrollHeight;
    this.countEl.textContent = `${this.entries.length} entries`;
  }

  /**
   * Escape HTML special characters in a string.
   * @param {string} str
   * @returns {string}
   */
  _escape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  /**
   * Show a modal prompt dialog and return the user's input as a Promise.
   * @param {string} msg - The prompt message.
   * @param {string|null} _default - The default input value.
   * @returns {Promise<string|null>}
   */
  _showPrompt(msg, _default) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in';
      overlay.innerHTML = `
        <div class="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-gray-700">
          <p class="text-gray-200 text-sm mb-4">${this._escape(String(msg))}</p>
          <input type="text" id="prompt-input" value="${this._escape(String(_default ?? ''))}"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <div class="flex gap-2 mt-4 justify-end">
            <button id="prompt-cancel" class="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors focus:outline-none">
              <i class="fa-solid fa-xmark mr-1"></i>Cancel
            </button>
            <button id="prompt-ok" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              <i class="fa-solid fa-check mr-1"></i>OK
            </button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      const input = overlay.querySelector('#prompt-input');
      input.focus();
      input.select();
      const cleanup = (val) => { if (document.body.contains(overlay)) document.body.removeChild(overlay); resolve(val); };
      overlay.querySelector('#prompt-ok').onclick = () => cleanup(input.value);
      overlay.querySelector('#prompt-cancel').onclick = () => cleanup(null);
      input.onkeydown = (e) => { if (e.key === 'Enter') cleanup(input.value); if (e.key === 'Escape') cleanup(null); };
    });
  }

  /**
   * Show a modal alert dialog and resolve when dismissed.
   * @param {string} msg - The alert message.
   * @returns {Promise<void>}
   */
  _showAlert(msg) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50 fade-in';
      overlay.innerHTML = `
        <div class="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-gray-700">
          <div class="flex items-start gap-3 mb-4">
            <i class="fa-solid fa-circle-info text-blue-400 mt-0.5"></i>
            <p class="text-gray-200 text-sm">${this._escape(String(msg))}</p>
          </div>
          <div class="flex justify-end">
            <button id="alert-ok" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              <i class="fa-solid fa-check mr-1"></i>OK
            </button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('#alert-ok').onclick = () => { if (document.body.contains(overlay)) document.body.removeChild(overlay); resolve(); };
      overlay.onkeydown = (e) => { if (e.key === 'Enter' || e.key === 'Escape') { if (document.body.contains(overlay)) document.body.removeChild(overlay); resolve(); } };
      overlay.querySelector('#alert-ok').focus();
    });
  }

  /** Clear all entries and re-render the empty panel. */
  clear() {
    this.entries = [];
    this._render();
  }
}

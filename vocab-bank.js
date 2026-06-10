/**
 * vocab-bank.js — Shared Vocabulary Bank Utility
 * Loaded by: exam.html, question-bank.html, past-exams.html
 *
 * Features:
 *  - VocabBank.saveWord({ word, context, source }, buttonEl)
 *  - ✅ "Saved!" for 2s then resets
 *  - ⚠️ "Already saved" if 409 from server
 *  - BroadcastChannel('vocab_updates') fires on every save so any open
 *    past-exams.html tab refreshes its panel instantly.
 *  - VocabBank.openSavePopup({ word, context, source }, anchorEl)
 *    renders an inline save popup below anchorEl.
 */

(function () {
  'use strict';

  // ── BroadcastChannel setup ──────────────────────────────────────────────
  let _channel = null;
  function getChannel() {
    if (!_channel) {
      try { _channel = new BroadcastChannel('vocab_updates'); } catch (e) { /* Safari private */ }
    }
    return _channel;
  }

  // ── Core save function ──────────────────────────────────────────────────
  async function saveWord({ word, context, source }, buttonEl) {
    if (!word || !word.trim()) return;

    const originalHtml = buttonEl ? buttonEl.innerHTML : '';
    const originalDisabled = buttonEl ? buttonEl.disabled : false;

    if (buttonEl) {
      buttonEl.disabled = true;
      buttonEl.innerHTML = '⏳ Saving…';
    }

    try {
      const token = localStorage.getItem('jwt_token') || '';
      const res = await fetch('/api/vocab/word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ word: word.trim(), context: context || '', source: source || '' })
      });

      if (res.ok) {
        // ✅ Saved!
        if (buttonEl) {
          buttonEl.innerHTML = '✅ Saved!';
          buttonEl.style.background = '#d1fae5';
          buttonEl.style.color = '#065f46';
          buttonEl.style.borderColor = '#6ee7b7';
        }
        // Broadcast to other open tabs (vocab_updates is the single canonical channel)
        const ch = getChannel();
        if (ch) ch.postMessage({ type: 'VOCAB_UPDATED', word: word.trim(), source });

        setTimeout(() => {
          if (buttonEl) {
            buttonEl.innerHTML = originalHtml;
            buttonEl.style.background = '';
            buttonEl.style.color = '';
            buttonEl.style.borderColor = '';
            buttonEl.disabled = originalDisabled;
          }
        }, 2000);

      } else if (res.status === 409) {
        // ⚠️ Already saved
        if (buttonEl) {
          buttonEl.innerHTML = '⚠️ Already saved';
          buttonEl.style.background = '#fef3c7';
          buttonEl.style.color = '#92400e';
          buttonEl.style.borderColor = '#fcd34d';
        }
        setTimeout(() => {
          if (buttonEl) {
            buttonEl.innerHTML = originalHtml;
            buttonEl.style.background = '';
            buttonEl.style.color = '';
            buttonEl.style.borderColor = '';
            buttonEl.disabled = originalDisabled;
          }
        }, 2000);

      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Save failed');
      }

    } catch (err) {
      console.error('[VocabBank] Save error:', err.message);
      if (buttonEl) {
        buttonEl.innerHTML = '❌ Error';
        buttonEl.style.background = '#fee2e2';
        buttonEl.style.color = '#991b1b';
        setTimeout(() => {
          buttonEl.innerHTML = originalHtml;
          buttonEl.style.background = '';
          buttonEl.style.color = '';
          buttonEl.disabled = originalDisabled;
        }, 2500);
      }
    }
  }

  // ── Inline save popup ───────────────────────────────────────────────────
  /**
   * Opens a compact inline popup anchored below `anchorEl`.
   * @param {object} opts - { word, context, source }
   * @param {HTMLElement} anchorEl - the button that was clicked
   */
  function openSavePopup({ word, context, source }, anchorEl) {
    // Remove any existing popup
    const existing = document.getElementById('vb-save-popup');
    if (existing) {
      existing.remove();
      // Toggle: if same anchor clicked again, just close
      if (existing.dataset.anchorId === (anchorEl && anchorEl.id)) return;
    }

    const popup = document.createElement('div');
    popup.id = 'vb-save-popup';
    popup.dataset.anchorId = anchorEl ? anchorEl.id : '';
    popup.style.cssText = `
      position: absolute;
      z-index: 9999;
      background: #fff;
      border: 1.5px solid #c4b5fd;
      border-radius: 14px;
      padding: 18px 20px;
      width: 320px;
      box-shadow: 0 8px 32px rgba(109,40,217,0.15);
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      animation: vbPopupIn 0.18s ease;
    `;

    // Dark-mode support
    if (document.body.classList.contains('dark')) {
      popup.style.background = '#1e1b4b';
      popup.style.borderColor = '#6d28d9';
      popup.style.color = '#f1f5f9';
    }

    popup.innerHTML = `
      <style>
        @keyframes vbPopupIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }
        #vb-save-popup label { display:block; font-size:11px; font-weight:700; color:#6d28d9; text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
        body.dark #vb-save-popup label { color:#a78bfa; }
        #vb-save-popup input, #vb-save-popup textarea {
          width:100%; border:1.5px solid #ede9fe; border-radius:8px;
          padding:8px 10px; font-size:13.5px; font-family:inherit;
          background:#faf5ff; color:#1e1b4b; outline:none;
          transition:border-color .15s;
        }
        body.dark #vb-save-popup input, body.dark #vb-save-popup textarea {
          background:#312e81; border-color:#4c1d95; color:#e0e7ff;
        }
        #vb-save-popup input:focus, #vb-save-popup textarea:focus { border-color:#8b5cf6; }
        #vb-save-popup textarea { resize:vertical; min-height:52px; }
        #vb-source-line { font-size:11px; color:#9ca3af; margin-top:6px; }
        #vb-btn-row { display:flex; gap:8px; margin-top:14px; }
        #vb-save-btn {
          flex:1; padding:9px; border-radius:8px; border:none; cursor:pointer;
          background:linear-gradient(135deg,#8b5cf6,#6d28d9); color:#fff;
          font-size:13px; font-weight:700; font-family:inherit;
          transition:opacity .2s;
        }
        #vb-save-btn:hover { opacity:.88; }
        #vb-cancel-btn {
          padding:9px 14px; border-radius:8px; border:1.5px solid #e5e7eb;
          background:transparent; cursor:pointer; font-size:13px;
          font-weight:600; font-family:inherit; color:#6b7280;
          transition:background .15s;
        }
        #vb-cancel-btn:hover { background:#f3f4f6; }
      </style>
      <div style="font-size:13.5px;font-weight:800;color:#6d28d9;margin-bottom:12px;">🌿 Save to Vocabulary Bank</div>
      <label>Word</label>
      <input id="vb-word-input" type="text" value="${_esc(word)}" placeholder="Enter word…" style="margin-bottom:10px;" />
      <label>Context sentence</label>
      <textarea id="vb-context-input" placeholder="Sentence containing the word…">${_esc(context)}</textarea>
      <div id="vb-source-line">📍 ${_esc(source)}</div>
      <div id="vb-btn-row">
        <button id="vb-save-btn">🌿 Save Word</button>
        <button id="vb-cancel-btn">Cancel</button>
      </div>
    `;

    // Position popup below anchor
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      popup.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 340) + 'px';
      popup.style.top = (rect.bottom + window.scrollY + 6) + 'px';
      document.body.appendChild(popup);
    } else {
      popup.style.position = 'fixed';
      popup.style.left = '50%';
      popup.style.top = '50%';
      popup.style.transform = 'translate(-50%,-50%)';
      document.body.appendChild(popup);
    }

    // Wire save button
    const saveBtn = document.getElementById('vb-save-btn');
    saveBtn.addEventListener('click', async () => {
      const w = document.getElementById('vb-word-input').value.trim();
      const c = document.getElementById('vb-context-input').value.trim();
      await saveWord({ word: w, context: c, source }, saveBtn);
      // Close popup on success (after brief delay for feedback)
      setTimeout(() => { if (popup.parentNode) popup.remove(); }, 2200);
    });

    document.getElementById('vb-cancel-btn').addEventListener('click', () => popup.remove());

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('mousedown', function outsideClick(e) {
        if (!popup.contains(e.target) && e.target !== anchorEl) {
          popup.remove();
          document.removeEventListener('mousedown', outsideClick);
        }
      });
    }, 50);
  }

  // ── Helper ───────────────────────────────────────────────────────────────
  function _esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Listen for BroadcastChannel events (used by past-exams.html panel) ──
  function onWordSaved(callback) {
    const ch = getChannel();
    if (ch) ch.addEventListener('message', (e) => {
      if (e.data && (e.data.type === 'VOCAB_UPDATED' || e.data.type === 'word_saved')) callback(e.data);
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.VocabBank = { saveWord, openSavePopup, onWordSaved };

})();

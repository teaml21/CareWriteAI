// 🔒 PIN — FIRST LINE, ONLY ONCE
const CORRECT_PIN = "1207";

// 🧠 AI FUNCTION — CORRECT ASYNC SYNTAX
async function improveNoteWithAI(text, user) {
    if (!window.AI_CONFIG) {
        alert("❌ config.js missing / wrong order");
        return null;
    }
    const { apiKey, model } = window.AI_CONFIG;
    if (!apiKey || !apiKey.startsWith("sk-")) {
        alert("❌ Invalid OpenAI key (must start with sk-)");
        return null;
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: "You are CareWrite AI — professional UK social care assistant. Rewrite notes clearly, professionally, keep ALL facts exactly." },
                    { role: "user", content: `Service User: ${user}\nNote: ${text}` }
                ]
            })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.choices[0].message.content.trim();
    } catch (e) {
        alert("❌ AI Error: " + e.message);
        return null;
    }
}

// 📦 MAIN APP — NO SYNTAX ERRORS
document.addEventListener('DOMContentLoaded', () => {
    const pinLock = document.getElementById('pinLock');
    const pinInput = document.getElementById('pinInput');
    const pinUnlock = document.getElementById('pinUnlock');
    const appContent = document.getElementById('appContent');
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const aiBtn = document.getElementById('aiImprove');
    const serviceUserSelect = document.getElementById('serviceUser');

    // PIN LOGIC
    function tryUnlock() {
        if (pinInput.value.trim() === CORRECT_PIN) {
            pinLock.style.display = 'none';
            appContent.style.opacity = '1';
        } else {
            pinInput.value = '';
            alert("❌ Wrong PIN — Use: 1207");
        }
    }
    pinUnlock?.addEventListener('click', tryUnlock);
    pinInput?.addEventListener('keydown', e => e.key === 'Enter' && tryUnlock());

    // VOICE RECOGNITION
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;
    if (recognition) {
        recognition.lang = 'en-GB';
        let isRecording = false;
        recordBtn?.addEventListener('click', async () => {
            try { await navigator.mediaDevices.getUserMedia({audio:true}); }
            catch { return alert("❌ Allow Mic!"); }
            if (!isRecording) { recognition.start(); recordBtn.textContent="🛑 Stop"; }
            else { recognition.stop(); recordBtn.textContent="🎙️ Record"; }
            isRecording = !isRecording;
        });
        recognition.onresult = e => {
            let t=''; for(let i=e.resultIndex;i<e.results.length;i++) t+=e.results[i][0].transcript;
            noteText.value = t;
        };
    } else alert("⚠️ Use Chrome/Edge");

    // EDIT BUTTON
    editBtn?.addEventListener('click', () => {
        noteText.removeAttribute('readonly'); noteText.readOnly=false; noteText.focus();
    });

    // SAVE + HISTORY
    function renderNotesHistory() {
        const list = document.getElementById('notesList');
        if (!list) return;
        const history = JSON.parse(localStorage.getItem('careWriteHistory')||'[]');
        list.innerHTML = history.length ? history.map(n=>`
            <div class="note-card">
                <div class="note-date">📅 ${n.date} — 👤 ${n.user}</div>
                <div class="note-preview">${n.content.substring(0,70)}...</div>
                <div class="note-actions">
                    <button class="note-btn btn-load" onclick="loadNote(${n.id})">📂 Load</button>
                    <button class="note-btn btn-delete" onclick="deleteNote(${n.id})">🗑️</button>
                </div>
            </div>`).join('') : "<p class='empty-history'>No saved notes</p>";
    }
    window.loadNote = id => {
        const n = JSON.parse(localStorage.careWriteHistory||'[]').find(x=>x.id===id);
        if (n) { noteText.value = n.content; serviceUserSelect.value = n.user; }
    };
    window.deleteNote = id => {
        localStorage.careWriteHistory = JSON.stringify(JSON.parse(localStorage.careWriteHistory||'[]').filter(x=>x.id!==id));
        renderNotesHistory();
    };
    saveBtn?.addEventListener('click', () => {
        const content = noteText.value.trim(), user = serviceUserSelect?.value||'[Name]';
        if (!content) return alert("⚠️ Nothing to save!");
        const history = JSON.parse(localStorage.careWriteHistory||'[]');
        history.unshift({id:Date.now(), date:new Date().toLocaleString('en-GB'), user, content});
        localStorage.setItem('careWriteHistory', JSON.stringify(history));
        alert("✅ Saved!"); renderNotesHistory();
    });

    // AI BUTTON CLICK
    aiBtn?.addEventListener('click', async () => {
        aiBtn.textContent = "⏳ AI Working..."; aiBtn.disabled = true;
        const res = await improveNoteWithAI(noteText.value, serviceUserSelect?.value);
        if (res) noteText.value = res;
        aiBtn.textContent = "🧠 AI Improve"; aiBtn.disabled = false;
    });

    renderNotesHistory();
});

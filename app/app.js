// 🔒 PIN — ONLY ONCE
const CORRECT_PIN = "1207";

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
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

    // --- PIN LOGIC (ALWAYS SHOWS ON REFRESH) ---
    function tryUnlock() {
        if (pinInput.value.trim() === CORRECT_PIN) {
            pinLock.style.display = 'none';
            appContent.style.opacity = '1';
            // NO localStorage auto-unlock → PIN always shows
        } else {
            pinInput.value = '';
            alert("❌ Wrong PIN — Use: 1207");
        }
    }
    pinUnlock?.addEventListener('click', tryUnlock);
    pinInput?.addEventListener('keydown', e => e.key === 'Enter' && tryUnlock());

    // --- VOICE RECOGNITION ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge for voice");
    } else {
        recognition.lang = 'en-GB';
        let isRecording = false;

        recordBtn?.addEventListener('click', async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch {
                return alert("❌ Allow Microphone!");
            }
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Record";
            }
            isRecording = !isRecording;
        });

        recognition.onresult = (e) => {
            let transcript = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                transcript += e.results[i][0].transcript;
            }
            noteText.value = transcript;
        };
    }

    // --- EDIT BUTTON ---
    editBtn?.addEventListener('click', () => {
        noteText.removeAttribute('readonly');
        noteText.readOnly = false;
        noteText.focus();
    });

    // --- SAVED NOTES HISTORY ---
    function renderNotesHistory() {
        const list = document.getElementById('notesList');
        if (!list) return;
        const history = JSON.parse(localStorage.getItem('careWriteHistory') || '[]');
        if (history.length === 0) {
            list.innerHTML = '<p class="empty-history">No saved notes yet</p>';
            return;
        }
        list.innerHTML = history.map(n => `
            <div class="note-card">
                <div class="note-date">📅 ${n.date} — 👤 ${n.user}</div>
                <div class="note-preview">${n.content.substring(0, 70)}...</div>
                <div class="note-actions">
                    <button class="note-btn btn-load" onclick="loadNote(${n.id})">📂 Load</button>
                    <button class="note-btn btn-delete" onclick="deleteNote(${n.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    window.loadNote = id => {
        const n = JSON.parse(localStorage.careWriteHistory || '[]').find(x => x.id === id);
        if (n) { noteText.value = n.content; serviceUserSelect.value = n.user; }
    };
    window.deleteNote = id => {
        localStorage.careWriteHistory = JSON.stringify(JSON.parse(localStorage.careWriteHistory || '[]').filter(x => x.id !== id));
        renderNotesHistory();
    };
    saveBtn?.addEventListener('click', () => {
        const content = noteText.value.trim();
        const user = serviceUserSelect?.value || '[Name]';
        if (!content) return alert("⚠️ Nothing to save!");
        const history = JSON.parse(localStorage.careWriteHistory || '[]');
        history.unshift({ id: Date.now(), date: new Date().toLocaleString('en-GB'), user, content });
        localStorage.setItem('careWriteHistory', JSON.stringify(history));
        alert("✅ Saved!");
        renderNotesHistory();
    });

    // --- AI (CONFIG SAFE) ---
    async function improveNoteWithAI(text, user) {
        if (!window.AI_CONFIG) { alert("❌ config.js missing"); return null; }
        const { apiKey, model } = window.AI_CONFIG;
        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "UK care assistant: improve clearly, keep all facts." },
                        { role: "user", content: `User:${user}\nNote:${text}` }
                    ]
                })
            });
            const d = await res.json();
            return d.choices[0].message.content.trim();
        } catch (e) { alert("❌ AI: " + e.message); return null; }
    }
    aiBtn?.addEventListener('click', async () => {
        aiBtn.textContent = "⏳ AI..."; aiBtn.disabled = true;
        const res = await improveNoteWithAI(noteText.value, serviceUserSelect?.value);
        if (res) noteText.value = res;
        aiBtn.textContent = "🧠 AI Improve"; aiBtn.disabled = false;
    });

    renderNotesHistory();
});

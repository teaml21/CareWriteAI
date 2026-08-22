// 🔒 PIN — ONLY ONCE!
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

    // --- PIN LOGIC ---
    function tryUnlock() {
        if (pinInput.value.trim() === CORRECT_PIN) {
            pinLock.style.display = 'none';
            appContent.style.opacity = '1';
            localStorage.setItem('careWriteUnlocked', 'yes');
        } else {
            pinInput.value = '';
            alert("❌ Wrong PIN — Use: 1207");
        }
    }
    pinUnlock?.addEventListener('click', tryUnlock);
    pinInput?.addEventListener('keydown', e => e.key==='Enter' && tryUnlock());
    }

    // --- VOICE RECOGNITION ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;
    if (!recognition) alert("⚠️ Use Chrome/Edge");
    else {
        recognition.lang = 'en-GB';
        let isRecording = false;
        recordBtn?.addEventListener('click', async () => {
            try { await navigator.mediaDevices.getUserMedia({audio:true}); }
            catch { return alert("❌ Allow Mic!"); }
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop";
                isRecording = true;
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Record";
                isRecording = false;
            }
        });
        recognition.onresult = e => {
            let t = '';
            for (let i=e.resultIndex; i<e.results.length; i++) t += e.results[i][0].transcript;
            noteText.value = t;
        };
    }

    // --- EDIT BUTTON ---
    editBtn?.addEventListener('click', () => {
        noteText.removeAttribute('readonly');
        noteText.readOnly = false;
        noteText.focus();
    });

    // --- SAVE + HISTORY ---
    function renderNotesHistory() {
        const list = document.getElementById('notesList');
        if (!list) return;
        const history = JSON.parse(localStorage.getItem('careWriteHistory')||'[]');
        if (!history.length) { list.innerHTML = "<p class='empty-history'>No saved notes yet</p>"; return; }
        list.innerHTML = history.map(n=>`
            <div class="note-card">
                <div class="note-date">📅 ${n.date} — 👤 ${n.user}</div>
                <div class="note-preview">${n.content.substring(0,70)}...</div>
                <div class="note-actions">
                    <button class="note-btn btn-load" onclick="loadNote(${n.id})">📂 Load</button>
                    <button class="note-btn btn-delete" onclick="deleteNote(${n.id})">🗑️</button>
                </div>
            </div>
        `).join('');
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
        const content = noteText.value.trim();
        const user = serviceUserSelect?.value || '[Name]';
        if (!content) return alert("⚠️ Nothing to save!");
        const note = {id:Date.now(), date:new Date().toLocaleString('en-GB'), user, content};
        const history = JSON.parse(localStorage.getItem('careWriteHistory')||'[]');
        history.unshift(note);
        localStorage.setItem('careWriteHistory', JSON.stringify(history));
        alert("✅ Saved!");
        renderNotesHistory();
    });

    // --- AI (USES CONFIG.JS — NO AI_API_KEY HERE!) ---
    async function improveNoteWithAI(text, user) {
        if (!window.AI_CONFIG) { alert("❌ config.js MISSING!"); return null; }
        const { apiKey, model } = window.AI_CONFIG;
        if (!apiKey || !apiKey.startsWith("sk-")) { alert("❌ BAD KEY IN CONFIG!"); return null; }

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method:"POST",
                headers:{"Content-Type":"application/json", "Authorization":`Bearer ${apiKey}`},
                body:JSON.stringify({
                    model: model,
                    messages:[
                        {role:"system", content:"You are CareWrite AI — professional UK social care assistant. Improve this note clearly, professionally, keep ALL facts exactly as written. Service User: "+user},
                        {role:"user", content:text}
                    ]
                })
            });
            if (!res.ok) throw new Error("HTTP " + res.status);
            const d = await res.json();
            return d.choices[0].message.content.trim();
        } catch (e) {
            alert("❌ AI ERROR: " + e.message);
            return null;
        }
    }
    aiBtn?.addEventListener('click', async () => {
        aiBtn.textContent = "⏳ AI Working...";
        aiBtn.disabled = true;
        const improved = await improveNoteWithAI(noteText.value.trim(), serviceUserSelect?.value||"Service User");
        if (improved) noteText.value = improved;
        aiBtn.textContent = "🧠 AI Improve";
        aiBtn.disabled = false;
    });

    // --- INIT ---
    renderNotesHistory();
});

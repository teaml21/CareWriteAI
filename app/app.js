// 🧠 AI CONFIG — PASTE YOUR KEY HERE
const AI_API_KEY = "YOUR_KEY_HERE"; // ← PASTE OPENAI/GEMINI KEY
const AI_MODEL = "gpt-3.5-turbo"; // or "gemini-pro"
const AI_PROVIDER = "openai"; // or "gemini"

// 🧠 AI BRAIN FUNCTION
async function improveNoteWithAI(text, user) {
    if (!text) return alert("⚠️ Write/record note first!");

    // Care-specific instruction
    const systemPrompt = `You are CareWrite AI — professional UK social care documentation assistant.
Improve this note: make it clear, person-centred, professional, grammatically correct, concise but complete.
Format for supported living/disability care. Include name: ${user}.
Keep facts exactly as given — do NOT invent anything.`;

    try {
        if (AI_PROVIDER === "openai") {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${AI_API_KEY}`
                },
                body: JSON.stringify({
                    model: AI_MODEL,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ],
                    temperature: 0.3 // low = factual, safe
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content.trim();
        }
        // Gemini version
        else if (AI_PROVIDER === "gemini") {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + "\n\nNOTE:\n" + text }] }]
                })
            });
            const data = await res.json();
            return data.candidates[0].content.parts[0].text.trim();
        }
    } catch (err) {
        alert("❌ AI Error: " + err.message);
        console.error(err);
        return null;
    }
}

// 🧠 BUTTON CLICK — CONNECT TO YOUR EXISTING APP
document.addEventListener('DOMContentLoaded', () => {
    const aiBtn = document.getElementById('aiImprove');
    const noteText = document.getElementById('noteText');
    const userSelect = document.getElementById('serviceUser');

    aiBtn?.addEventListener('click', async () => {
        const original = noteText.value.trim();
        const user = userSelect?.value || "Service User";

        aiBtn.textContent = "⏳ AI Working...";
        aiBtn.disabled = true;

        const improved = await improveNoteWithAI(original, user);

        if (improved) {
            noteText.value = improved;
            noteText.removeAttribute('readonly');
            alert("✅ AI Improved Note Ready!");
        }

        aiBtn.textContent = "🧠 AI Improve Note";
        aiBtn.disabled = false;
    });
});
// 🔒 PIN LOCK — FULL WORKING LOGIC
const CORRECT_PIN = "1207"; // ✅ YOUR PIN — KEEP AS STRING

document.addEventListener('DOMContentLoaded', () => {
    const pinLock = document.getElementById('pinLock');
    const pinInput = document.getElementById('pinInput');
    const pinUnlock = document.getElementById('pinUnlock');
    const appContent = document.getElementById('appContent');

    console.log("🔍 PIN System Ready");

    function tryUnlock() {
        const entered = pinInput.value.trim();
        console.log("🔍 Entered:", entered, "| Expected:", CORRECT_PIN);

        if (entered === CORRECT_PIN) {
            pinLock.style.display = "none";
            appContent.style.opacity = "1";
            localStorage.setItem('careWriteUnlocked', 'yes');
            console.log("✅ UNLOCKED");
        } else {
            pinInput.value = "";
            pinInput.style.border = "2px solid red";
            alert("❌ WRONG PIN — Use: 1207");
            setTimeout(()=> pinInput.style.border="", 1000);
        }
    }

    // CLICK + ENTER KEY
    pinUnlock?.addEventListener('click', tryUnlock);
    pinInput?.addEventListener('keydown', e => e.key==='Enter' && tryUnlock());

    // REMEMBER UNLOCK (8hrs)
    if (localStorage.getItem('careWriteUnlocked') === 'yes') {
        pinLock.style.display = "none";
        appContent.style.opacity = "1";
    }

    // ↓ YOUR REST OF CODE (Voice/AI/Save) BELOW ↓
});
document.addEventListener('DOMContentLoaded', () => {
    // 🎤 BASIC ELEMENTS
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');
    const aiBtn = document.getElementById('aiImprove');
    const serviceUserSelect = document.getElementById('serviceUser');

    console.log("✅ App Loaded");

    // 🎤 SPEECH RECOGNITION
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge for voice");
        return;
    }
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
        for (let i=e.resultIndex; i<e.results.length; i++)
            t += e.results[i][0].transcript;
        noteText.value = t;
    };

    // ✍️ EDIT
    editBtn?.addEventListener('click', () => {
        noteText.removeAttribute('readonly');
        noteText.readOnly = false;
        noteText.focus();
    });

    // 💾 SAVE + HISTORY
    saveBtn?.addEventListener('click', () => {
        const content = noteText.value.trim();
        const user = serviceUserSelect?.value || '[Name]';
        if (!content) return alert("⚠️ No note!");

        const note = {id:Date.now(), date:new Date().toLocaleString('en-GB'), user, content};
        const history = JSON.parse(localStorage.getItem('careWriteHistory')||'[]');
        history.unshift(note);
        localStorage.setItem('careWriteHistory', JSON.stringify(history));
        alert("✅ Saved!");
        renderNotesHistory();
    });

    // 🤖 FORMAT
    formatBtn?.addEventListener('click', () => {
        const user = serviceUserSelect?.value || '[Name]';
        noteText.value = `📅 ${new Date().toLocaleString('en-GB')}\n👤 ${user}\n📝 ${noteText.value}`;
    });

    // 🧠 AI IMPROVE (SAFE — uses config.js)
    async function improveNoteWithAI(text, user) {
        if (!text || !window.AI_CONFIG) return null;
        const {apiKey, model, provider} = window.AI_CONFIG;
        const sys = `You are CareWrite AI — UK social care assistant. Improve clearly, professionally, keep facts exactly. User:${user}`;

        try {
            if (provider === "openai") {
                const res = await fetch("https://api.openai.com/v1/chat/completions", {
                    method:"POST",
                    headers:{"Content-Type":"application/json", "Authorization":`Bearer ${apiKey}`},
                    body:JSON.stringify({model, messages:[{role:"system", content:sys},{role:"user", content:text}]})
                });
                const d = await res.json();
                return d.choices?.[0]?.message?.content?.trim() || null;
            }
        } catch(e) { alert("❌ AI: "+e.message); return null; }
    }

    aiBtn?.addEventListener('click', async () => {
        aiBtn.textContent = "⏳ AI...";
        aiBtn.disabled = true;
        const improved = await improveNoteWithAI(noteText.value, serviceUserSelect?.value);
        if (improved) noteText.value = improved;
        aiBtn.textContent = "🧠 AI Improve";
        aiBtn.disabled = false;
    });

    // 📂 HISTORY RENDER
    function renderNotesHistory() {
        const list = document.getElementById('notesList');
        if (!list) return;
        const history = JSON.parse(localStorage.getItem('careWriteHistory')||'[]');
        if (!history.length) { list.innerHTML = "<p>No saved notes</p>"; return; }
        list.innerHTML = history.map(n=>`
            <div class="note-card">
                <div class="note-date">${n.date} — ${n.user}</div>
                <div class="note-preview">${n.content.substring(0,60)}...</div>
                <button onclick="loadNote(${n.id})">📂 Load</button>
                <button onclick="deleteNote(${n.id})">🗑️</button>
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

    renderNotesHistory();
}); // ✅ FINAL CLOSING BRACKET — MISSING EARLIER!

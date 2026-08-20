// 🧠 AI Csk-proj-a6nBauvHizAjnEYrhC8EXhCsxzWd4UsagXbwyPzAJOjybaBLSPEYY3aCWM_4tU9gsYjuH2uYpCT3BlbkFJ6eJbundmjV8dJleFmP_KaSkchX3cPEGu_MdIDERctKsnwhmb8LScDMPKAL7OnDb1HGrv7pcOQAONFIG — PASTE YOUR KEY HERE
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
// 🔒 PIN LOCK SYSTEM — CONFIGURE YOUR PIN HERE
const CORRECT_PIN = "1212"; // ✅ CHANGE THIS TO YOUR OWN 4-DIGIT PIN!

document.addEventListener('DOMContentLoaded', () => {
    const pinLock = document.getElementById('pinLock');
    const pinInput = document.getElementById('pinInput');
    const pinUnlock = document.getElementById('pinUnlock');
    const appContent = document.getElementById('appContent');

    // Try unlock
    function attemptUnlock() {
        if (pinInput.value === CORRECT_PIN) {
            // ✅ CORRECT PIN — UNLOCK APP
            pinLock.style.display = 'none';
            appContent.style.opacity = '1';
            localStorage.setItem('pinUnlocked', Date.now());
        } else {
            // ❌ WRONG PIN
            pinInput.value = '';
            pinInput.style.borderColor = '#ef4444';
            alert("❌ Wrong PIN — try again!");
            pinInput.style.borderColor = '#444';
        }
    }

    // Click button OR press Enter key
    pinUnlock?.addEventListener('click', attemptUnlock);
    pinInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptUnlock();
    });

    // Auto-unlock for 8 hours after first success
    const lastUnlock = localStorage.getItem('pinUnlocked');
    if (lastUnlock && (Date.now() - lastUnlock) < 28800000) {
        pinLock.style.display = 'none';
        appContent.style.opacity = '1';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const serviceUserSelect = document.getElementById('serviceUser');

    console.log('✅ JS Loaded');

    // 🎤 SPEECH SETUP
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome or Edge browser");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = true; // ✅ LIVE TEXT WHILE SPEAKING
    recognition.continuous = true;      // ✅ KEEP LISTENING
    recognition.maxAlternatives = 1;

    let isRecording = false;
    let fullTranscript = ''; // ✅ STORES SPEECH

    // 🎙️ RECORD BUTTON
    recordBtn.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });

            if (!isRecording) {
                fullTranscript = ''; // CLEAR ON NEW RECORDING
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
                recordBtn.style.background = "#ef4444";
                noteText.value = "🎤 Listening... Speak now";
                noteText.removeAttribute('readonly'); // ✅ LIVE TYPING
                isRecording = true;
                console.log("✅ Recording started");
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Start Recording";
                recordBtn.style.background = "#991b1b";
                noteText.value = fullTranscript; // ✅ SAVE FINAL TEXT
                noteText.setAttribute('readonly', 'true'); // ✅ LOCK AFTER
                isRecording = false;
                console.log("✅ Stopped. Text saved:", fullTranscript);
            }
        } catch (err) {
            alert("❌ Click 🔒 in address bar → ALLOW Microphone");
        }
    });

    // ✅ THIS IS WHERE TEXT APPEARS — FIXED!
    recognition.onresult = (event) => {
        let interim = '';
        fullTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                fullTranscript += event.results[i][0].transcript + ' ';
            } else {
                interim += event.results[i][0].transcript;
            }
        }

        noteText.value = fullTranscript + interim; // ✅ LIVE UPDATE
    };

    // ✍️ EDIT BUTTON — FORCE EDIT MODE
    editBtn?.addEventListener('click', () => {
        // Remove readonly attribute COMPLETELY
        noteText.removeAttribute('readonly');
        // Also set to editable explicitly
        noteText.readOnly = false;
        // Highlight & focus so you can type immediately
        noteText.focus();
        noteText.style.background = '#2a1f1f'; // Visual feedback
        alert("✅ EDIT MODE ON — Type freely now!");
    });

     // 💾 SAVE BUTTON — NOW SAVES TO HISTORY
    saveBtn?.addEventListener('click', () => {
        const noteContent = noteText.value.trim();
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        
        if (!noteContent) return alert("⚠️ Nothing to save!");

        // Create note object
        const note = {
            id: Date.now(),
            date: new Date().toLocaleString("en-GB"),
            user: user,
            content: noteContent
        };

        // Get existing history & add new note
        let savedNotes = JSON.parse(localStorage.getItem('careWriteHistory') || '[]');
        savedNotes.unshift(note); // Newest at top
        localStorage.setItem('careWriteHistory', JSON.stringify(savedNotes));

        alert("✅ Note Saved to History!");
        noteText.setAttribute('readonly', 'true');
        
        // Refresh history list instantly
        renderNotesHistory();
    });
    

    // 🤖 FORMAT BUTTON
    document.getElementById('formatBtn')?.addEventListener('click', () => {
        const user = serviceUserSelect?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📍 Type: Daily Support
────────────────────────────────────
📝 Observation:
${noteText.value}

✅ Action Taken:
• Support provided as needed
• Observed well-being
────────────────────────────────────
CareWrite AI — Record`;
    });

    // 📋 TEMPLATES
    document.getElementById('tplDaily')?.addEventListener('click', () => {
        const user = serviceUserSelect?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📋 Daily Note
────────────────────────────────────
📝 ${noteText.value}
✅ Actions completed
────────────────────────────────────
CareWrite AI`;
    });

    document.getElementById('tplIncident')?.addEventListener('click', () => {
        const user = serviceUserSelect?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `⚠️ INCIDENT REPORT
📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📝 What happened:
${noteText.value}
✅ Action taken:
────────────────────────────────────
CareWrite AI`;
    });

    document.getElementById('tplMed')?.addEventListener('click', () => {
        const user = serviceUserSelect?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `💊 MEDICATION LOG
📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
💊 Details:
${noteText.value}
────────────────────────────────────
CareWrite AI`;
    });

    document.getElementById('tplHandover')?.addEventListener('click', () => {
        const user = serviceUserSelect?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `🔄 SHIFT HANDOVER
📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📝 Updates:
${noteText.value}
────────────────────────────────────
CareWrite AI`;
    });

    // 📄 PDF BUTTON
    const actionsDiv = document.querySelector('.actions');
    if (actionsDiv) {
        const exportBtn = document.createElement('button');
        exportBtn.textContent = "📥 Save PDF";
        exportBtn.className = "btn-primary";
        exportBtn.style.marginTop = "15px";
        exportBtn.style.width = "100%";
        actionsDiv.appendChild(exportBtn);

        exportBtn.addEventListener('click', () => {
            if (!noteText.value) return alert("⚠️ No note to save!");
            window.print();
        });
    }

    // ✅ LOAD SAVED NOTE ON START
    noteText.value = localStorage.getItem('careNote') || '';
     // 📂 RENDER SAVED NOTES LIST
    function renderNotesHistory() {
        const listContainer = document.getElementById('notesList');
        if (!listContainer) return;

        const savedNotes = JSON.parse(localStorage.getItem('careWriteHistory') || '[]');

        if (savedNotes.length === 0) {
            listContainer.innerHTML = '<p class="empty-history">No saved notes yet — save your first note!</p>';
            return;
        }

        listContainer.innerHTML = '';

        savedNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <div class="note-header">
                    <span class="note-date">📅 ${note.date}</span>
                    <span class="note-user">👤 ${note.user}</span>
                </div>
                <div class="note-preview">${note.content.substring(0, 60)}${note.content.length > 60 ? '...' : ''}</div>
                <div class="note-actions">
                    <button class="note-btn btn-load" data-id="${note.id}">📂 Load</button>
                    <button class="note-btn btn-delete" data-id="${note.id}">🗑️ Delete</button>
                </div>
            `;
            listContainer.appendChild(card);
        });

        // ⬇️ Attach Load & Delete Listeners
        document.querySelectorAll('.btn-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                loadNote(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm("❌ Delete this note forever?")) {
                    const id = parseInt(btn.dataset.id);
                    deleteNote(id);
                }
            });
        });
    }

    // 📂 LOAD NOTE BACK INTO EDITOR
    window.loadNote = function(id) {
        const savedNotes = JSON.parse(localStorage.getItem('careWriteHistory') || '[]');
        const note = savedNotes.find(n => n.id === id);
        if (note) {
            noteText.value = note.content;
            noteText.removeAttribute('readonly');
            noteText.focus();
            // Try to match service user dropdown
            const userSelect = document.getElementById('serviceUser');
            if (userSelect) userSelect.value = note.user;
            alert("✅ Note Loaded! You can now edit & re-save.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 🗑️ DELETE NOTE
    window.deleteNote = function(id) {
        let savedNotes = JSON.parse(localStorage.getItem('careWriteHistory') || '[]');
        savedNotes = savedNotes.filter(n => n.id !== id);
        localStorage.setItem('careWriteHistory', JSON.stringify(savedNotes));
        renderNotesHistory();
    };

    // ✅ LOAD HISTORY AUTOMATICALLY ON PAGE OPEN
    renderNotesHistory();
});

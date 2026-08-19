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

    // 💾 SAVE BUTTON
    document.getElementById('saveBtn')?.addEventListener('click', () => {
        localStorage.setItem('careNote', noteText.value);
        alert("✅ Saved to device!");
        noteText.setAttribute('readonly', 'true');
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
});

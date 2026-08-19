document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');

    // 🎤 SPEECH RECOGNITION — FIRST & SAFE
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge for voice");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = true;
    let isRecording = false;

    recordBtn.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
                recordBtn.style.background = "#ef4444";
                noteText.value = "🎤 Listening...";
                isRecording = true;
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Start Recording";
                recordBtn.style.background = "#991b1b";
                isRecording = false;
            }
        } catch (err) {
            alert("❌ Allow Microphone!");
        }
    });

    // ✅ SPEECH → TEXT — CRITICAL!
    recognition.addEventListener('result', (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
        }
        noteText.value = transcript;
    });

    recognition.addEventListener('error', (e) => {
        alert("❌ Error: " + e.error);
        isRecording = false;
        recordBtn.textContent = "🎙️ Start Recording";
    });

    // ✍️ EDIT BUTTON
    editBtn?.addEventListener('click', () => noteText.removeAttribute('readonly'));

    // 💾 SAVE BUTTON
    saveBtn?.addEventListener('click', () => {
        localStorage.setItem('careNote', noteText.value);
        alert("✅ Saved!");
        noteText.setAttribute('readonly', true);
    });

    // 🤖 AI FORMAT
    formatBtn?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📍 Type: Daily Support
────────────────────────────────────
📝 Observation:
${noteText.value}
✅ Action Taken:
• Support provided
• Wellbeing observed
────────────────────────────────────
CareWrite AI`;
    });

    // 📄 PDF BUTTON — SAFE ORDER
    const actionsDiv = document.querySelector('.actions');
    if (actionsDiv) {
        const exportBtn = document.createElement('button');
        exportBtn.textContent = "📥 Save PDF";
        exportBtn.className = "btn-primary";
        exportBtn.style.marginTop = "15px";
        exportBtn.style.width = "100%";
        actionsDiv.appendChild(exportBtn);

        exportBtn.addEventListener('click', () => {
            if (!noteText.value) return alert("⚠️ No note!");
            window.print();
        });
    }

    // 📋 TEMPLATES — ALL 4
    document.getElementById('tplDaily')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📋 Daily Note
────────────────────────────────────
📝 Observation:
${noteText.value}
✅ Actions:
• Support given
• Mood/Health checked
────────────────────────────────────
CareWrite AI`;
    });

    document.getElementById('tplIncident')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `⚠️ INCIDENT
📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📝 Event:
${noteText.value}
✅ Action:
────────────────────────────────────
CareWrite AI`;
    });

    document.getElementById('tplMed')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `💊 MEDICATION
📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
💊 Details:
${noteText.value}
────────────────────────────────────
CareWrite AI`;
    });

    document.getElementById('tplHandover')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `🔄 HANDOVER
📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📝 Notes:
${noteText.value}
────────────────────────────────────
CareWrite AI`;
    });

    // 📂 LOAD SAVED NOTE
    noteText.value = localStorage.getItem('careNote') || '';
}); // ✅ FINAL CLOSING BRACKET — MISSING EARLIER!

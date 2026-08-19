document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome or Edge");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = true;
    let isRecording = false;

    // 🎤 RECORD BUTTON — WORKS FIRST!
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

    // ✅ SPEECH → TEXT — THIS IS WHAT MATTERS!
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

    // 🤖 FORMAT BUTTON
    formatBtn?.addEventListener('click', () => {
        // GET SELECTED USER
        const selectedUser = document.getElementBYID ('serviceUser')?. value ||'[Name]';
        
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: [Name]
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

    // 📄 PDF BUTTON — MADE SAFE NOW!
    const actionsDiv = document.querySelector('.actions');
    if (actionsDiv) {
        const exportBtn = document.createElement('button');
        exportBtn.textContent = "📥 Save as PDF";
        exportBtn.className = "btn-primary";
        exportBtn.style.marginTop = "20px";
        exportBtn.style.width = "100%";
        actionsDiv.appendChild(exportBtn);

        exportBtn.addEventListener('click', () => {
            if (!noteText.value) return alert("⚠️ Write or record a note first!");
            alert("✅ Select 'Save as PDF' from the menu!");
            window.print();
        });
        // 📋 DAILY NOTE TEMPLATE
    document.getElementById('tplDaily')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
📋 Type: Daily Support Note
────────────────────────────────────
📝 Observation:
${noteText.value}

✅ Actions Completed:
• Support provided as needed
• Observed well-being & mood
• Hydration / meals monitored
────────────────────────────────────
CareWrite AI — Daily Record`;
    });

    // ⚠️ INCIDENT REPORT TEMPLATE
    document.getElementById('tplIncident')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `⚠️ INCIDENT / CONCERN REPORT
📅 Date/Time: ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}

📝 What Happened:
${noteText.value}

👥 Who Was Involved:
• Staff Present: _______________
• Witnesses: _______________

✅ Action Taken / Outcome:
• Immediate action: _______________
• Reported to: _______________
• Follow-up needed: Yes / No

🖊️ Staff Signature: _______________
────────────────────────────────────
CareWrite AI — Incident Log`;
    });

    // 💊 MEDICATION RECORD TEMPLATE
    document.getElementById('tplMed')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `💊 MEDICATION ADMINISTRATION
📅 Date: ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}

💊 Medication Given:
${noteText.value}

✅ Details:
• Time: _______________
• Dose: _______________
• Route: Oral / Topical / Other
• Given by: _______________
• Witnessed by: _______________

🟢 Outcome / Observation:
• Taken ✅ Refused ⚠️ Not Given ❌
• Any side effects noted: _______________
────────────────────────────────────
CareWrite AI — Med Log`;
    });

    // 🔄 HANDOVER NOTE TEMPLATE
    document.getElementById('tplHandover')?.addEventListener('click', () => {
        const user = document.getElementById('serviceUser')?.value || '[Name]';
        if (!noteText.value) return alert("⚠️ Record or type first!");
        noteText.value = `🔄 SHIFT HANDOVER NOTE
📅 Date: ${new Date().toLocaleString("en-GB")}
👤 Service User: ${user}
👤 Handover From: _______________
👤 Handover To: _______________

📝 Key Updates / Notes:
${noteText.value}

⚠️ Urgent / Priority Actions:
• _______________
• _______________

✅ Tasks for Next Shift:
• _______________
• _______________
────────────────────────────────────
CareWrite AI — Handover`;
    });
✅ Step 3: Add Button Styling (Optional — looks better!)
Add this to style.css at the end:
css
/* 📋 TEMPLATE BUTTONS ROW */
.actions {
    gap: 10px;
    margin-top: 20px;
}
.btn {
    font-size: 14px;
    padding: 12px 10px;
}
    }

    // ✅ LOAD SAVED NOTE
    noteText.value = localStorage.getItem('careNote') || '';
});

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

    editBtn?.addEventListener('click', () => noteText.removeAttribute('readonly'));

    saveBtn?.addEventListener('click', () => {
        localStorage.setItem('careNote', noteText.value);
        alert("✅ Saved!");
        noteText.setAttribute('readonly', true);
    });

    formatBtn?.addEventListener('click', () => {
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

    noteText.value = localStorage.getItem('careNote') || '';
});

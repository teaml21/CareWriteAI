document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');

    console.log("✅ JS Loaded!");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge for voice");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = true; // ✅ LIVE TEXT WHILE SPEAKING
    recognition.maxAlternatives = 1;
    let isRecording = false;
    let finalTranscript = '';

    recordBtn.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
                recordBtn.style.background = "#ef4444";
                finalTranscript = '';
                noteText.value = '🎙️ Listening...';
                isRecording = true;
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Start Recording";
                recordBtn.style.background = "#991b1b";
                isRecording = false;
            }
        } catch (err) {
            alert("❌ Allow Microphone in site settings!");
        }
    });

    // ✅ LIVE + FINAL TEXT
    recognition.addEventListener('result', (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            const text = e.results[i][0].transcript;
            if (e.results[i].isFinal) finalTranscript += text + ' ';
            else interim += text;
        }
        noteText.value = finalTranscript + interim;
    });

    recognition.addEventListener('end', () => {
        isRecording = false;
        recordBtn.textContent = "🎙️ Start Recording";
        recordBtn.style.background = "#0D9488";
    });

    recognition.addEventListener('error', (e) => {
        alert("❌ Error: " + e.error);
        isRecording = false;
        recordBtn.textContent = "🎙️ Start Recording";
    });

    editBtn?.addEventListener('click', () => noteText.removeAttribute('readonly'));

    saveBtn?.addEventListener('click', () => {
        localStorage.setItem('careNote', noteText.value);
        alert("✅ Note Saved to Device!");
        noteText.setAttribute('readonly', true);
    });

    formatBtn?.addEventListener('click', () => {
        if (!noteText.value) return alert("⚠️ Record or type a note first!");
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

// ✅ LOAD SAVED NOTE
noteText.value = localStorage.getItem('careNote') || '';

// 📄 PDF EXPORT BUTTON
const exportBtn = document.createElement('button');
exportBtn.textContent = "📩 Save PDF";
exportBtn.className = "btn-secondary";
exportBtn.style.width = "100%";
exportBtn.style.marginTop = "15px";
document.querySelector('.actions').appendChild(exportBtn);

exportBtn.addEventListener('click', () => {
    if (!noteText.value) return alert("⚠️ No note to save!");
    window.print();
});

}); // ✅ FINAL CLOSING — DO NOT MISS!
});

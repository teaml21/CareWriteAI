document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');

    console.log("✅ JS Loaded!");

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge for voice");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    let isRecording = false;

    // 🎤 Record Button
    recordBtn.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
                isRecording = true;
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Start Recording";
                isRecording = false;
            }
        } catch (err) {
            alert("❌ Allow Microphone!");
        }
    });

    // ✅ CRITICAL: THIS PUTS TEXT IN BOX!
    recognition.addEventListener('result', (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
        }
        noteText.value = transcript;
        console.log("📝 Text saved:", transcript);
    });

    recognition.addEventListener('error', (e) => {
        alert("❌ Error: " + e.error);
        isRecording = false;
        recordBtn.textContent = "🎙️ Start Recording";
    });

    // Other Buttons
    editBtn?.addEventListener('click', () => noteText.removeAttribute('readonly'));
    saveBtn?.addEventListener('click', () => alert("✅ Saved!"));
    formatBtn?.addEventListener('click', () => {
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `📅 ${new Date().toLocaleString()}\n📝 ${noteText.value}`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');

    console.log("✅ JS Loaded! Elements found:", !!recordBtn, !!noteText);

    // Speech Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    let isRecording = false;

    // 🎤 Record
    recordBtn.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
                isRecording = true;
                console.log("🎙️ Recording started");
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Start Recording";
                isRecording = false;
                console.log("🛑 Stopped");
            }
        } catch (e) { alert("❌ Allow Mic!"); }
    });

    // ✅ THIS IS THE KEY MISSING PART: SHOW TEXT
    recognition.onresult = (e) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
        }
        noteText.value = transcript; // ✅ Puts text in box!
        console.log("📝 TEXT IN BOX:", transcript);
    };

    recognition.onerror = e => alert("❌ Error: " + e.error);
});

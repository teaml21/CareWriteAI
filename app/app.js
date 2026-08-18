document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');

    console.log("✅ JS Loaded! Elements found:", !!recordBtn, !!noteText);

    // Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome/Edge for voice");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    let isRecording = false;

    // 🎤 RECORD BUTTON
    recordBtn.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 Stop Recording";
                recordBtn.style.background = "#ef4444";
                isRecording = true;
                console.log("🎙️ Recording started");
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ Start Recording";
                recordBtn.style.background = "#0D9488";
                isRecording = false;
                console.log("🛑 Stopped");
            }
        } catch (err) {
            alert("❌ Allow Microphone in site settings!");
            console.error(err);
        }
    });

    // 📥 RESULT
    recognition.onresult = (e) => {
        let text = "";
        for (let i = 0; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
        }
        noteText.value = text;
        console.log("📝 Text:", text);
    };

    recognition.onerror = (e) => {
        alert("❌ Error: " + e.error);
        isRecording = false;
        recordBtn.textContent = "🎙️ Start Recording";
    };

    // OTHER BUTTONS
    editBtn.onclick = () => noteText.removeAttribute('readonly');
    saveBtn.onclick = () => alert("✅ Saved!");
    formatBtn.onclick = () => {
        if (!noteText.value) return alert("⚠️ Record first");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}\n📍 CareWrite AI\n📝 Note:\n${noteText.value}`;
    };
});

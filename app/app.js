const recordBtn = document.getElementById('recordBtn');
const noteText = document.getElementById('noteText');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const formatBtn = document.getElementById('formatBtn');

// ✅ Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (!recognition) {
    alert("⚠️ Use Chrome or Edge for voice recording!");
} else {
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

let isRecording = false;

// 🎙️ Record Button
recordBtn.addEventListener('click', () => {
    if (!recognition) return alert("❌ Not supported — use Chrome/Edge");

    if (!isRecording) {
        recognition.start();
        recordBtn.textContent = "🛑 Stop Recording";
        recordBtn.style.background = "#0D9488";
        isRecording = true;
    } else {
        recognition.stop();
        recordBtn.textContent = "🎙️ Start Recording";
        recordBtn.style.background = "#991b1b";
        isRecording = false;
    }
});

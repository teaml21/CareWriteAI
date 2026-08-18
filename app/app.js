const recordBtn = document.getElementById('recordBtn');
const noteText = document.getElementById('noteText');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const formatBtn = document.getElementById('formatBtn');

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.lang = 'en-GB';
    recognition.interimResults = false; // Only final text
    recognition.maxAlternatives = 1;
} else {
    alert("⚠️ Use Chrome/Edge for voice");
}

let isRecording = false;

// Record Toggle
recordBtn.addEventListener('click', () => {
    if (!recognition) return;

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

// ✅ THIS IS THE FIXED PART — CLEAR TRANSCRIPT + DISPLAY
recognition.addEventListener('result', (e) => {
    let transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
    }
    noteText.value = transcript; // Puts text in box
});

recognition.addEventListener('end', () => {
    isRecording = false;
    recordBtn.textContent = "🎙️ Start Recording";
    recordBtn.style.background = "#991b1b";
});

recognition.addEventListener('error', (e) => {
    alert(`Voice Error: ${e.error}`);
    isRecording = false;
    recordBtn.textContent = "🎙️ Start Recording";
});

// Edit
editBtn.addEventListener('click', () => {
    noteText.removeAttribute('readonly');
    noteText.focus();
});

// Save
saveBtn.addEventListener('click', () => {
    alert("✅ Note Saved!");
    noteText.setAttribute('readonly', true);
});

// AI Format
formatBtn.addEventListener('click', () => {
    if (!noteText.value) return alert("⚠️ Record first!");
    noteText.value = `📅 ${new Date().toLocaleString("en-GB")}
📍 Service User: Demo
📝 Note:
${noteText.value}
✅ Ready for records`;
});
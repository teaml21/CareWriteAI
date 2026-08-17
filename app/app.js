// Select elements
const recordBtn = document.getElementById('recordBtn');
const noteOutput = document.getElementById('noteOutput');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-GB';

// Recording State
let isRecording = false;

// Button Click
recordBtn.addEventListener('click', () => {
    if (!isRecording) {
        recognition.start();
        recordBtn.textContent = "🛑 Stop Recording";
        recordBtn.classList.add('recording');
        isRecording = true;
    } else {
        recognition.stop();
        recordBtn.textContent = "🎙️ Start Recording";
        recordBtn.classList.remove('recording');
        isRecording = false;
    }
});

// On Result
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    noteOutput.value = transcript;
    // Later: AI formatting here
};

// Edit Button
editBtn.addEventListener('click', () => {
    noteOutput.removeAttribute('readonly');
    noteOutput.focus();
});

// Save Button
saveBtn.addEventListener('click', () => {
    alert("✅ Note Saved (Demo)");
    noteOutput.setAttribute('readonly', true);
});
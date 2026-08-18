const recordBtn = document.getElementById('recordBtn');
const noteText = document.getElementById('noteText');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const formatBtn = document.getElementById('formatBtn');

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) { recognition.lang = 'en-GB'; recognition.continuous = false; }

let recording = false;

// Record Toggle
recordBtn.addEventListener('click', () => {
    if (!recognition) { alert('Use Chrome/Edge for voice'); return; }
    if (!recording) {
        recognition.start();
        recordBtn.textContent = "🛑 Stop Recording";
        recordBtn.classList.add('active');
        recording = true;
    } else {
        recognition.stop();
        recordBtn.textContent = "🎙️ Start Recording";
        recordBtn.classList.remove('active');
        recording = false;
    }
});

// Result
recognition?.addEventListener('result', e => {
    const transcript = e.results[0][0].transcript;
    noteText.value = transcript;
});

// Edit
editBtn.addEventListener('click', () => {
    noteText.removeAttribute('readonly'); noteText.focus();
});

// Save
saveBtn.addEventListener('click', () => {
    alert("✅ Note Saved! (Demo)"); noteText.setAttribute('readonly', true);
});

// AI Format (simulate)
formatBtn.addEventListener('click', () => {
    if (!noteText.value) return alert('Record first!');
    noteText.value = `📅 ${new Date().toLocaleString()}\n📍 Service: CareWrite Demo\n📝 Note:\n• ${noteText.value.split('.').join('.\n• ')}`;
});

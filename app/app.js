document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ PAGE LOADED");

    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');

    console.log("🔍 recordBtn found:", !!recordBtn);
    console.log("🔍 noteText found:", !!noteText);

    if (!recordBtn || !noteText) {
        alert("❌ BUTTON OR TEXTBOX ID WRONG! Check HTML matches: recordBtn / noteText");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("⚠️ Use Chrome or Edge browser");
        return;
    }

    recognition.lang = 'en-GB';
    let isRecording = false;

    recordBtn.addEventListener('click', async () => {
        console.log("🎤 BUTTON CLICKED");
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 STOP";
                isRecording = true;
                console.log("✅ RECORDING STARTED");
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ RECORD";
                isRecording = false;
            }
        } catch (e) {
            alert("❌ CLICK 🔒 IN ADDRESS BAR → ALLOW MICROPHONE");
        }
    });

    recognition.addEventListener('result', (e) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
        }
        noteText.value = text;
        console.log("📝 TEXT:", text);
    });

    recognition.addEventListener('error', (e) => {
        alert("❌ ERROR: " + e.error);
        isRecording = false;
        recordBtn.textContent = "🎙️ RECORD";
    });
});

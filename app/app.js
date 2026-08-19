document.addEventListener('DOMContentLoaded', () => {
    // 🔍 CHECK ELEMENTS FIRST
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formatBtn = document.getElementById('formatBtn');

    console.log("🔍 Button found:", !!recordBtn);
    console.log("🔍 Textarea found:", !!noteText);

    if (!noteText) {
        alert("❌ FATAL: Textarea ID must be exactly: noteText");
        return;
    }

    // 🎤 SPEECH SETUP
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert("❌ ONLY WORKS: Chrome / Edge (Android/Desktop)");
        return;
    }

    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.continuous = false;
    let isRecording = false;

    // 🎙️ RECORD BUTTON
    recordBtn.addEventListener('click', async () => {
        try {
            // 🔒 FORCE MIC PERMISSION
            await navigator.mediaDevices.getUserMedia({ audio: true });

            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = "🛑 STOP";
                recordBtn.style.background = "#ef4444";
                noteText.value = "🎤 Recording... Speak now";
                console.log("✅ Recording started");
                isRecording = true;
            } else {
                recognition.stop();
                recordBtn.textContent = "🎙️ START";
                recordBtn.style.background = "#0D9488";
                console.log("✅ Stopped");
                isRecording = false;
            }
        } catch (err) {
            alert("❌ MIC BLOCKED! Tap 🔒 in address bar → Allow");
            console.error(err);
        }
    });

    // ✅ THIS IS THE GUARANTEED TEXT INJECTION
    recognition.onresult = (event) => {
        console.log("📥 Result event:", event.results);
        let output = "";
        for (let i = 0; i < event.results.length; i++) {
            output += event.results[i][0].transcript;
        }
        noteText.value = output;
        console.log("✅ TEXT SET TO BOX:", output);
    };

    // ⚠️ ERROR HANDLING
    recognition.onerror = (e) => {
        alert("❌ Voice Error: " + e.error);
        noteText.value = "⚠️ Error — try again";
        isRecording = false;
        recordBtn.textContent = "🎙️ START";
    };

    recognition.onend = () => {
        isRecording = false;
        recordBtn.textContent = "🎙️ START";
    };

    // OTHER BUTTONS
    editBtn?.addEventListener('click', () => {
        noteText.removeAttribute('readonly');
        noteText.focus();
    });

    saveBtn?.addEventListener('click', () => {
        alert("✅ Saved!");
        noteText.setAttribute('readonly', true);
    });

    formatBtn?.addEventListener('click', () => {
        if (!noteText.value) return alert("⚠️ Record first!");
        noteText.value = `📅 ${new Date().toLocaleString("en-GB")}\n📝 ${noteText.value}`;
    });
});

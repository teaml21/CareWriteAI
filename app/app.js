// // WRAP EVERYTHING — stops PIN/load errors ✅
document.addEventListener('DOMContentLoaded', () => {

  // 🧩 ELEMENTS — matches your HTML exactly
  const pinLock = document.getElementById('pinLock');
  const pinInput = document.getElementById('pinInput');
  const pinUnlockBtn = document.getElementById('pinUnlock');
  const appContent = document.getElementById('appContent');

  const noteText = document.getElementById('noteText');
  const aiImprove = document.getElementById('aiImprove');
  const editBtn = document.getElementById('editBtn');
  const serviceUser = document.getElementById('serviceUser');
  const recordBtn = document.getElementById('recordBtn');

  // 🔑 PIN SETUP — simple & safe
  // You can change this PIN anytime
  const CORRECT_PIN = '1234';

  if (pinUnlockBtn) {
    pinUnlockBtn.addEventListener('click', () => {
      if (pinInput.value.trim() === CORRECT_PIN) {
        // ✅ UNLOCK
        if (pinLock) pinLock.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
      } else {
        alert('❌ Incorrect PIN — try again');
        pinInput.value = '';
        pinInput.focus();
      }
    });
  }

  // 🤖 AI IMPROVE — matches your /api/improve endpoint
  if (aiImprove) {
    aiImprove.addEventListener('click', async () => {
      const raw = noteText.value.trim();
      if (!raw) {
        alert('⚠️ Write/record note first');
        return;
      }

      aiImprove.disabled = true;
      aiImprove.textContent = "Improving…";

      try {
        const res = await fetch('/api/improve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: raw })
        });

        const data = await res.json();
        if (data.improved) noteText.value = data.improved;
        else throw new Error(data.error || 'No reply');
      } catch (e) {
        alert('❌ Error: ' + e.message);
      } finally {
        aiImprove.disabled = false;
        aiImprove.textContent = "✨ AI Improve Note";
      }
    });
  }

  // 🎤 Speech / Edit / Record can go below — space ready
  // …
let isRecording = false;

recordBtn.addEventListener('click', () => {
  if (!recognition) return alert("Speech not supported here");

  if (!isRecording) {
    recognition.start();
    recordBtn.textContent = "🛑 Stop Recording";
    recordBtn.classList.add('active');
    isRecording = true;
  } else {
    recognition.stop();
    recordBtn.textContent = "🎤 Record";
    recordBtn.classList.remove('active');
    isRecording = false;
  }
});

// ✅ When speech finishes → put text into note box
recognition?.addEventListener('result', (e) => {
  const transcript = e.results[0][0].transcript;
  noteText.value += (noteText.value ? " " : "") + transcript;
});

// ✅ Reset after end/error
recognition?.addEventListener('end', () => {
  recordBtn.textContent = "🎤 Record";
  recordBtn.classList.remove('active');
  isRecording = false;
});
recognition?.addEventListener('error', (err) => {
  alert("Voice error: " + err.message);
  recordBtn.textContent = "🎤 Record";
  recordBtn.classList.remove('active');
  isRecording = false;
});

}); // ✅ FINAL CLOSING BRACKET — fixes "Unexpected end"

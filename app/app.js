// WRAP EVERYTHING — stops PIN/load errors ✅
document.addEventListener('DOMContentLoaded', () => {

  // 🧩 ELEMENTS — declared ONCE at top
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
  const CORRECT_PIN = '1234'; // ✅ Change PIN here anytime

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

  // 🎤 RECORD BUTTON — WORKS IN CHROME/EDGE
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
  }

  let isRecording = false;

  if (recordBtn) {
    recordBtn.addEventListener('click', () => {
      if (!recognition) {
        alert('⚠️ Please use Chrome or Edge for voice recording');
        return;
      }
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
  }

  // ✅ Text appears in your box
  recognition?.addEventListener('result', (e) => {
    const words = e.results[0][0].transcript;
    noteText.value += (noteText.value ? " " : "") + words;
  });

  // ✅ Reset when done
  recognition?.addEventListener('end', () => {
    recordBtn.textContent = "🎤 Record";
    recordBtn.classList.remove('active');
    isRecording = false;
  });

  recognition?.addEventListener('error', () => {
    recordBtn.textContent = "🎤 Record";
    recordBtn.classList.remove('active');
    isRecording = false;
  });

}); // ✅ FINAL CLOSING BRACKET — DO NOT DELETE

document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // ELEMENTS
  // ==============================

  const recordBtn = document.getElementById('recordBtn');
  const noteText = document.getElementById('noteText');
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const formatBtn = document.getElementById('formatBtn');
  const aiImprove = document.getElementById('aiImprove');

  const pinLock = document.getElementById('pinLock');
  const pinInput = document.getElementById('pinInput');
  const pinUnlock = document.getElementById('pinUnlock');

  const serviceUser = document.getElementById('serviceUser');

  // ==============================
  // PIN LOCK
  // ==============================

  const CORRECT_PIN =
    window.CONFIG && CONFIG.PIN
      ? String(CONFIG.PIN)
      : '1207';

  if (pinUnlock) {
    pinUnlock.addEventListener('click', () => {

      if (pinInput && String(pinInput.value) === CORRECT_PIN) {

        if (pinLock) {
          pinLock.style.display = 'none';
        }

      } else {

        alert('❌ Wrong PIN');

        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }

      }
    });
  }

  if (pinInput) {
    pinInput.addEventListener('keydown', (event) => {

      if (event.key === 'Enter' && pinUnlock) {
        pinUnlock.click();
      }

    });
  }

  // ==============================
  // VOICE RECOGNITION
  // ==============================

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const recognition =
    SpeechRecognition
      ? new SpeechRecognition()
      : null;

  if (recognition) {
    recognition.lang = 'en-GB';
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  let isRecording = false;

  if (recordBtn) {

    recordBtn.addEventListener('click', () => {

      if (!recognition) {

        alert(
          '⚠️ Voice recording is not supported by this browser. Try Chrome or Edge.'
        );

        return;
      }

      if (!isRecording) {

        try {

          recognition.start();

          isRecording = true;

          recordBtn.textContent = '🛑 Stop Recording';
          recordBtn.classList.add('active');

        } catch (error) {

          console.error('Recording error:', error);

        }

      } else {

        recognition.stop();

        isRecording = false;

        recordBtn.textContent = '🎤 Record';
        recordBtn.classList.remove('active');

      }

    });

  }

  if (recognition) {

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      if (noteText) {

        noteText.value +=
          (noteText.value ? ' ' : '') +
          transcript;

      }

    };

    recognition.onend = () => {

      isRecording = false;

      if (recordBtn) {

        recordBtn.textContent = '🎤 Record';
        recordBtn.classList.remove('active');

      }

    };

    recognition.onerror = (event) => {

      console.error(
        'Speech recognition error:',
        event.error
      );

      isRecording = false;

      if (recordBtn) {

        recordBtn.textContent = '🎤 Record';
        recordBtn.classList.remove('active');

      }

    };

  }

  // ==============================
  // EDIT BUTTON
  // ==============================

  if (editBtn) {

    editBtn.addEventListener('click', () => {

      if (!noteText) return;

      noteText.focus();

      noteText.setSelectionRange(
        noteText.value.length,
        noteText.value.length
      );

    });

  }

  // ==============================
  // FORMAT NOTE
  // ==============================

  if (formatBtn) {

    formatBtn.addEventListener('click', () => {

      if (!noteText) return;

      const text = noteText.value.trim();

      if (!text) {

        alert('⚠️ Please enter or record a note first.');

        return;

      }

      const formatted = text
        .replace(/\s+/g, ' ')
        .replace(/\.\s+/g, '.\n')
        .trim();

      noteText.value = formatted;

    });

  }

  // ==============================
// AI IMPROVE NOTE
// ==============================

if (aiImprove) {
  aiImprove.addEventListener('click', async () => {

    if (!noteText) return;

    const text = noteText.value.trim();

    if (!text) {
      alert('⚠️ Please enter or record a note first.');
      return;
    }

    aiImprove.disabled = true;
    aiImprove.textContent = '🧠 Improving...';

    try {
      const response = await fetch('https://care-write-ai.vercel.app/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI request failed');
      }

      if (!data.improved) {
        throw new Error('No improved note was returned');
      }

      noteText.value = data.improved;

      alert('✅ AI has improved your care note.');

    } catch (error) {

      console.error('AI Improve error:', error);

      alert(
        '❌ AI improvement failed.\n\n' +
        'Please check the Vercel deployment and API settings.'
      );

    } finally {
      aiImprove.disabled = false;
      aiImprove.textContent = '🧠 AI Improve Note';
    }

  });
}

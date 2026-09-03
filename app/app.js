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
      : '1234';

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

    aiImprove.addEventListener('click', () => {

      if (!noteText) return;

      const text = noteText.value.trim();

      if (!text) {

        alert('⚠️ Please enter or record a note first.');

        return;

      }

      /*
       * TEMPORARY SAFE AI IMPROVEMENT
       *
       * This prepares the note for the real AI.
       * The actual AI API will be connected through
       * a secure backend later.
       */

      const improved =
        text
          .replace(/\s+/g, ' ')
          .trim();

      noteText.value =
        'Care Record:\n\n' +
        improved +
        '\n\n';

      alert(
        '✅ Note prepared for AI improvement. ' +
        'The secure AI connection is the next step.'
      );

    });

  }

  // ==============================
  // SAVE NOTE
  // ==============================

  if (saveBtn) {

    saveBtn.addEventListener('click', () => {

      if (!noteText) return;

      const note =
        noteText.value.trim();

      const user =
        serviceUser && serviceUser.value
          ? serviceUser.value
          : 'Unassigned';

      if (!note) {

        alert('⚠️ No note to save.');

        return;

      }

      const record = {

        user: user,

        note: note,

        date: new Date().toLocaleString('en-GB')

      };

      let saved = [];

      try {

        saved =
          JSON.parse(
            localStorage.getItem('careNotes') || '[]'
          );

      } catch (error) {

        saved = [];

      }

      saved.push(record);

      localStorage.setItem(
        'careNotes',
        JSON.stringify(saved)
      );

      alert('✅ Care record saved successfully.');

    });

  }

  // ==============================
  // SERVICE USER LIST
  // ==============================

  if (serviceUser) {

    const users = [

      {
        val: '',
        name: '— Select Name —'
      },

      {
        val: 'sarah',
        name: 'Sarah'
      },

      {
        val: 'james',
        name: 'James'
      },

      {
        val: 'maria',
        name: 'Maria'
      },

      {
        val: 'robert',
        name: 'Robert'
      },

      {
        val: 'emma',
        name: 'Emma'
      }

    ];

    serviceUser.innerHTML =
      users
        .map(
          user =>
            `<option value="${user.val}">
              ${user.name}
            </option>`
        )
        .join('');

  }

  // ==============================
  // TEMPLATE BUTTONS
  // ==============================

  const templates = {

    tplDaily:
      'Daily Care Note:\n\n' +
      'Date/Time:\n' +
      'Presentation:\n' +
      'Activities:\n' +
      'Support Provided:\n' +
      'Outcome:\n' +
      'Any Concerns:\n',

    tplIncident:
      'Incident Record:\n\n' +
      'Date/Time:\n' +
      'Location:\n' +
      'What happened:\n' +
      'People involved:\n' +
      'Immediate action taken:\n' +
      'Outcome:\n' +
      'Who was informed:\n',

    tplMed:
      'Medication Record:\n\n' +
      'Date/Time:\n' +
      'Medication:\n' +
      'Dose:\n' +
      'Route:\n' +
      'Reason:\n' +
      'Outcome/Response:\n' +
      'Any concerns:\n',

    tplHandover:
      'Handover:\n\n' +
      'Service User:\n' +
      'Current presentation:\n' +
      'Important events:\n' +
      'Support provided:\n' +
      'Medication:\n' +
      'Outstanding actions:\n' +
      'Important information for next staff member:\n'

  };

  Object.keys(templates).forEach((id) => {

    const button =
      document.getElementById(id);

    if (!button) return;

    button.addEventListener('click', () => {

      if (!noteText) return;

      if (noteText.value.trim()) {

        const confirmed =
          confirm(
            'Replace the current note with this template?'
          );

        if (!confirmed) return;

      }

      noteText.value =
        templates[id];

      noteText.focus();

    });

  });

  // ==============================
  // TEXTBOX
  // ==============================

  if (noteText) {

    noteText.style.width = '100%';
    noteText.style.minHeight = '150px';
    noteText.style.padding = '12px';

  }

});
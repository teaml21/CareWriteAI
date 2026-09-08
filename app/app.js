// WRAP EVERYTHING — stops PIN/load errors ✅
document.addEventListener('DOMContentLoaded', () => {

  // 🧩 ELEMENTS — declared ONCE at top
  const pinLock = document.getElementById('pinLock');
  const pinInput = document.getElementById('pinInput');
  const pinUnlockBtn = document.getElementById('pinUnlock');
  const appContent = document.getElementById('appContent');
  const noteText = document.getElementById('noteText');
  const aiImprove = document.getElementById('aiImprove');
  const aiFormatBtn = document.getElementById('formatBtn');
  const editBtn = document.getElementById('editBtn');
  const dailyNoteBtn = document.getElementById('tplDaily');
  const incidentBtn = document.getElementById('tplIncident');
  const medicationBtn = document.getElementById('tplMed');
  const saveBtn = document.getElementById('saveBtn');
  const handoverBtn = document.getElementById('tplHandover');
  const newNoteCard = document.getElementById('newNoteCard');
  const myRecordsCard = document.getElementById('myRecordsCard');
  const serviceUsersCard = document.getElementById('serviceUsersCard');
  const serviceUser = document.getElementById('serviceUser');
  const settingsCard = document.getElementById('settingsCard');
  const recordBtn = document.getElementById('recordBtn');
  let currentRecordType = 'General Note';
  // 👥 LOAD SAVED SERVICE USERS
const savedServiceUsers = JSON.parse(
  localStorage.getItem('carewrite_service_users') || '[]'
);

savedServiceUsers.forEach((name) => {
  const exists = Array.from(serviceUser.options)
    .some(option => option.value === name);

  if (!exists) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    serviceUser.appendChild(option);
  }
});

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
  // ✅ SAVE & APPROVE
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const note = noteText.value.trim();
    const user = serviceUser.value;

    if (!user) {
      alert('⚠️ Please select a service user');
      return;
    }

    if (!note) {
      alert('⚠️ Please write or record a note first');
      return;
    }

    const records = JSON.parse(localStorage.getItem('carewrite_records') || '[]');

    records.unshift({
      serviceUser: user,
      note: note,
      recordType: currentRecordType,
      approved: true,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem('carewrite_records', JSON.stringify(records));

    alert('✅ Note saved and approved');
  });
}
  // ⚠️ INCIDENT
if (incidentBtn) {
  incidentBtn.addEventListener('click', () => {
    currentRecordType = 'Incident';
    const existing = noteText.value.trim();

    const template =
`INCIDENT RECORD

What Happened:
${existing}

Where It Happened:

People Present:

Immediate Action Taken:

Injury / Harm:

First Aid / Medical Attention:

Who Was Informed:

Follow-Up Required:

Additional Information:`;

    noteText.value = template;
    noteText.focus();
  });
}
  // 📁 MY RECORDS
if (myRecordsCard) {
  myRecordsCard.addEventListener('click', () => {
    const records = JSON.parse(localStorage.getItem('carewrite_records') || '[]');

    if (records.length === 0) {
      alert('📁 No saved records yet');
      return;
    }

    const recordList = records.map((record, index) => {
      const date = new Date(record.createdAt).toLocaleString();

return `${index + 1}. ${record.serviceUser}
Type: ${record.recordType || 'General Note'}
Date: ${date}

${record.note}`;
    }).join('\n\n--------------------\n\n');

    noteText.value = recordList;
    noteText.focus();
  });
}
  // 🤖 AI FORMAT
if (aiFormatBtn) {
  aiFormatBtn.addEventListener('click', () => {
    const note = noteText.value.trim();

    if (!note) {
      alert('⚠️ Please write or record a note first');
      return;
    }

    let formatted = note
      .replace(/\s+/g, ' ')
      .trim();

    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    if (!/[.!?]$/.test(formatted)) {
      formatted += '.';
    }

    formatted = formatted
      .replace(/\bwas happy\b/gi, 'appeared happy')
      .replace(/\bhad lunch\b/gi, 'had their lunch')
      .replace(/\bhad breakfast\b/gi, 'had their breakfast')
      .replace(/\bhad a walk\b/gi, 'went for a walk');

    noteText.value = formatted;

    alert('🤖 Note formatted');
  });
}
  // 📝 DAILY NOTE
if (dailyNoteBtn) {
  dailyNoteBtn.addEventListener('click', () => {
    currentRecordType = 'Daily Note';
    const existing = noteText.value.trim();

    const template =
`DAILY NOTE

Presentation / Mood:
${existing}

Activities:

Meals and Drinks:

Personal Care:

Health / Medication:

Support Provided:

Additional Information:`;

    noteText.value = template;
    noteText.focus();
  });
}
  // 💊 MEDICATION
if (medicationBtn) {
  medicationBtn.addEventListener('click', () => {
    currentRecordType = 'Medication';
    const existing = noteText.value.trim();

    const template =
`MEDICATION RECORD

Medication / Treatment:
${existing}

Time Given:

Dose:

Route:

Reason Given:

Outcome / Effect:

Any Refusal or Difficulty:

Any Side Effects / Concerns:

Who Was Informed:

Additional Information:`;

    noteText.value = template;
    noteText.focus();
  });
}
  // 🔄 HANDOVER
if (handoverBtn) {
  handoverBtn.addEventListener('click', () => {
    currentRecordType = 'Handover';
    const existing = noteText.value.trim();

    const template =
`HANDOVER NOTE

Current Presentation:
${existing}

Mood / Behaviour:

Activities Completed:

Meals / Drinks:

Medication / Health:

Personal Care:

Any Concerns:

Important Information for Next Staff:

Follow-Up Required:`;

    noteText.value = template;
    noteText.focus();
  });
}
  // 📄 NEW NOTE
if (newNoteCard) {
  newNoteCard.addEventListener('click', () => {
    currentRecordType = 'General Note';
    const hasNote = noteText.value.trim().length > 0;

    if (hasNote) {
      const confirmed = confirm('Start a new note? Your current unsaved text will be cleared.');

      if (!confirmed) return;
    }

    noteText.value = '';
    serviceUser.value = '';
    noteText.focus();
  });
}
  // 📁 MY RECORDS
if (myRecordsCard) {
  myRecordsCard.addEventListener('click', () => {
    const records = JSON.parse(localStorage.getItem('carewrite_records') || '[]');

    if (records.length === 0) {
      alert('📁 No saved records yet');
      return;
    }

    const recordList = records.map((record, index) => {
      const date = new Date(record.createdAt).toLocaleString();

      return `${index + 1}. ${record.serviceUser}
${date}
${record.note}`;
    }).join('\n\n--------------------\n\n');

    noteText.value = recordList;
    noteText.focus();
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
       const res = await fetch('https://care-write-ai.vercel.app/api/improve', { 
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
  // 👥 SERVICE USERS
// 👥 SERVICE USERS
if (serviceUsersCard) {
  if (serviceUsersCard) {
  serviceUsersCard.addEventListener('click', () => {
    const newUser = prompt('👥 Add a new service user name:');

    if (!newUser) return;

    const name = newUser.trim();

    if (!name) return;

    const savedUsers = JSON.parse(
      localStorage.getItem('carewrite_service_users') || '[]'
    );

    if (savedUsers.includes(name)) {
      alert('⚠️ That service user already exists');
      return;
    }

    savedUsers.push(name);

    localStorage.setItem(
      'carewrite_service_users',
      JSON.stringify(savedUsers)
    );

    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    serviceUser.appendChild(option);

    alert('✅ Service user added');
  });
}
  serviceUsersCard.addEventListener('click', () => {
    const newUser = prompt('👥 Add a new service user name:');

    if (!newUser) return;

    const name = newUser.trim();

    if (!name) return;

    const savedUsers = JSON.parse(
      localStorage.getItem('carewrite_service_users') || '[]'
    );

    if (savedUsers.includes(name)) {
      alert('⚠️ That service user already exists');
      return;
    }

    savedUsers.push(name);

    localStorage.setItem(
      'carewrite_service_users',
      JSON.stringify(savedUsers)
    );

    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    serviceUser.appendChild(option);

    alert('✅ Service user added');
  });
}
  // ⚙️ SETTINGS
if (settingsCard) {
  settingsCard.addEventListener('click', () => {
    alert(
      '⚙️ CareWrite AI Settings\n\n' +
      'App: CareWrite AI\n' +
      'Voice recording: Enabled\n' +
      'AI formatting: Enabled\n' +
      'Records: Saved on this device'
    );
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

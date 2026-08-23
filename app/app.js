document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTS ---
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

  // --- PIN LOCK ---
  const CORRECT_PIN = CONFIG.PIN;
  pinUnlock.addEventListener('click', () => {
    if (pinInput.value === CORRECT_PIN) {
      pinLock.style.display = 'none';
    } else {
      alert('❌ Wrong PIN');
      pinInput.value = '';
    }
  });
  pinInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') pinUnlock.click();
  });

  // --- VOICE RECOGNITION ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  if (recognition) recognition.lang = 'en-GB';
  let isRecording = false;

  if (recordBtn) {
    recordBtn.addEventListener('click', () => {
      if (!recognition) { alert('⚠️ Use Chrome/Edge'); return; }
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

  if (recognition) {
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      noteText.value += (noteText.value ? ' ' : '') + transcript;
    };
    recognition.onend = () => {
      isRecording = false;
      if (recordBtn) {
        recordBtn.textContent = "🎤 Record";
        recordBtn.classList.remove('active');
      }
    };
  }

  // --- BUTTONS ---
  if (saveBtn) saveBtn.addEventListener('click', () => {
    const note = noteText.value.trim();
    const user = serviceUser.value || 'Unassigned';
    if (!note) { alert('⚠️ No note to save'); return; }
    const record = { user, note, date: new Date().toLocaleString() };
    const saved = JSON.parse(localStorage.getItem('careNotes') || '[]');
    saved.push(record);
    localStorage.setItem('careNotes', JSON.stringify(saved));
    alert('✅ Saved!');
  });

  if (editBtn) editBtn.addEventListener('click', () => noteText.focus());
  if (formatBtn) formatBtn.addEventListener('click', () => {
    noteText.value = noteText.value
      .replace(/\s+/g, ' ').trim()
      .split('. ').join('.\n');
  });

  // --- TEXTBOX & DROPDOWN FIX ---
  noteText.style.width = '100%';
  noteText.style.minHeight = '150px';
  noteText.style.padding = '12px';

  // Add full service user list
  const users = [
    {val:'',name:'— Select Name —'},
    {val:'sarah',name:'Sarah'},
    {val:'james',name:'James'},
    {val:'maria',name:'Maria'},
    {val:'robert',name:'Robert'},
    {val:'emma',name:'Emma'}
  ];
  serviceUser.innerHTML = users.map(u=>`<option value="${u.val}">${u.name}</option>`).join('');

}); // ✅ FINAL CLOSING BRACKET — MISSING BEFORE!

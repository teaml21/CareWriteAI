document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('recordBtn');
    const noteText = document.getElementById('noteText');
    const serviceUserSelect = document.getElementById('serviceUser');

    console.log('✅ JS loaded');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
        alert('⚠️ Use Chrome/Edge');
        return;
    }

    recognition.lang = 'en-GB';
    let isRecording = false;

    recordBtn?.addEventListener('click', async () => {
        try {
            await navigator.mediaDevices.getUserMedia({audio:true});
            if (!isRecording) {
                recognition.start();
                recordBtn.textContent = '🛑 Stop';
                isRecording = true;
            } else {
                recognition.stop();
                recordBtn.textContent = '🎙️ Record';
                isRecording = false;
            }
        } catch { alert('❌ Allow mic!'); }
    });

    recognition.addEventListener('result', e => {
        let t = '';
        for (let i=e.resultIndex; i<e.results.length; i++)
            t += e.results[i][0].transcript;
        noteText.value = t;
    });

    recognition.addEventListener('error', () => {
        isRecording = false;
        recordBtn.textContent = '🎙️ Record';
    });

    // Format & templates
    document.getElementById('formatBtn')?.addEventListener('click', formatNote);
    document.getElementById('tplDaily')?.addEventListener('click', formatNote);
    document.getElementById('tplIncident')?.addEventListener('click', formatNote);
    document.getElementById('tplMed')?.addEventListener('click', formatNote);
    document.getElementById('tplHandover')?.addEventListener('click', formatNote);

    function formatNote() {
        const user = serviceUserSelect?.value || '[Name]';
        noteText.value = `📅 ${new Date().toLocaleString('en-GB')}\n👤 ${user}\n📝 ${noteText.value}`;
    }

    noteText.value = localStorage.getItem('careNote') || '';
});

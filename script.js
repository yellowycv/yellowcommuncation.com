document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveWordBtn = document.getElementById('save-word-btn');
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const transcription = document.getElementById('transcription');
    let recognition;
    let finalTranscript = '';

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            copyBtn.disabled = true;
            saveWordBtn.disabled = true;
            savePdfBtn.disabled = true;
            finalTranscript = '';
            transcription.value = '';
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            transcription.value = finalTranscript + interimTranscript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
        };

        recognition.onend = () => {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            copyBtn.disabled = false;
            saveWordBtn.disabled = false;
            savePdfBtn.disabled = false;
        };

        startBtn.addEventListener('click', () => {
            recognition.start();
        });

        stopBtn.addEventListener('click', () => {
            recognition.stop();
        });

        copyBtn.addEventListener('click', () => {
            transcription.select();
            document.execCommand('copy');
            alert('Text copied to clipboard');
        });

        clearBtn.addEventListener('click', () => {
            finalTranscript = '';
            transcription.value = '';
        });

        saveWordBtn.addEventListener('click', () => {
            const blob = new Blob([transcription.value], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            saveAs(blob, 'transcription.docx');
        });

        savePdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const text = transcription.value;
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 10, 10);
            doc.save('transcription.pdf');
        });
    } else {
        console.error('Speech recognition not supported in this browser.');
    }
});

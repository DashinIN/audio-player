
//Логика создания визуализации с помощью canvas
const audio = document.getElementById('audioPlayer');
const audioVisualizer = document.getElementById('audioVisualizer');
const canvasContext = audioVisualizer.getContext('2d');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

canvasContext.clearRect(0, 0, audioVisualizer.width, audioVisualizer.height);

function draw() {
    analyser.getByteFrequencyData(dataArray);
    canvasContext.clearRect(0, 0, audioVisualizer.width, audioVisualizer.height);

    const barWidth = (audioVisualizer.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    //Визуализация представляет собой колонки по частотам воспроизводящегося аудио
    //в зависимости от частот меняется высота колонки и ее цвет
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasContext.fillStyle = `rgb(${barHeight}, 40, 230)`;
        canvasContext.fillRect(x, audioVisualizer.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
    }

    requestAnimationFrame(draw);
}

//При запуске и паузе соответвтенно либо запускаем отрисовку либо останавливаем
audio.addEventListener('play', () => {
    audioContext.resume().then(() => {
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        draw();
    });
});

audio.addEventListener('pause', () => {
    audioContext.suspend();
});

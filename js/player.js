import { formatTime } from "./formatTime.js";


//Логика работы плеера
const audio = document.getElementById('audioPlayer');
const playPauseButton =  document.querySelector('.play__button img');

const seekBar = document.querySelector('.time__bar');
const currentTime =  document.querySelector('.current__time');
const totalTime =  document.querySelector('.total__time');
const volumeBar =  document.querySelector('.volume__bar');

//При нажатии на кнопку воспроизвеления либо останавливаем либо включаем трек
playPauseButton.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
        playPauseButton.src = './assets/pause.svg'
    } else {
        audio.pause();
        playPauseButton.src = './assets/play.svg'
    }
});

let updateInterval;
//Вносим временной интервал для изменения временной дорожки
audio.addEventListener('timeupdate', function () {
    const currentTimeInSeconds = audio.currentTime;
    const durationInSeconds = audio.duration;

    // Вычисляем прогресс в процентах
    const progressPercentage = (currentTimeInSeconds / durationInSeconds) * 100;

    // Устанавливаем значение seekBar
    seekBar.value = progressPercentage;

    currentTime.innerHTML = formatTime(currentTimeInSeconds);
    totalTime.innerHTML = formatTime(durationInSeconds);
});


audio.addEventListener('play', function () {
    //Интервал устанавливаем одну секунду для избежания лагов при взаимодействии с инпутом
    updateInterval = setInterval(function () {
        const currentTimeInSeconds = audio.currentTime;
        const durationInSeconds = audio.duration;

        // Вычисляем прогресс в процентах
        const progressPercentage = (currentTimeInSeconds / durationInSeconds) * 100;

        // Устанавливаем значение seekBar
        seekBar.value = progressPercentage;

        currentTime.innerHTML = formatTime(currentTimeInSeconds);
        totalTime.innerHTML = formatTime(durationInSeconds);
    }, 1000); // Обновление каждую секунду
});

//При остановки трека интервал отчищаем
audio.addEventListener('pause', function () {
    clearInterval(updateInterval);
});

//При перемотке вычислям новое положение и отчищаем старый интервал
seekBar.addEventListener('input', function () {
    clearInterval(updateInterval);
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

//При изменении положения перемотки выполняем ту же логику как и при начале проигрывания
seekBar.addEventListener('change', function () {
    updateInterval = setInterval(function () {
        const currentTimeInSeconds = audio.currentTime;
        const durationInSeconds = audio.duration;

        // Вычисляем прогресс в процентах
        const progressPercentage = (currentTimeInSeconds / durationInSeconds) * 100;

        // Устанавливаем значение seekBar
        seekBar.value = progressPercentage;

        currentTime.innerHTML = formatTime(currentTimeInSeconds);
        totalTime.innerHTML = formatTime(durationInSeconds);
    }, 1000); // Обновление каждую секунду
});

//Изменение громкости
volumeBar.addEventListener('change', function () {
    audio.volume = volumeBar.value;
});

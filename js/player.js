import { formatTime } from "./formatTime.js";

const audio = document.getElementById('audioPlayer');
const playPauseButton =  document.querySelector('.play__button img');

const seekBar = document.querySelector('.time__bar');
const currentTime =  document.querySelector('.current__time');
const totalTime =  document.querySelector('.total__time');
const volumeBar =  document.querySelector('.volume__bar');


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


audio.addEventListener('pause', function () {
    clearInterval(updateInterval);
});


seekBar.addEventListener('input', function () {
    clearInterval(updateInterval);
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});


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

    
volumeBar.addEventListener('change', function () {
    audio.volume = volumeBar.value;
});

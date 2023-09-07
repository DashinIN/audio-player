
//Функция форматирует время для отображения в плеере
export const formatTime = (seconds) => {
    if(!seconds) return '0:00'
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}
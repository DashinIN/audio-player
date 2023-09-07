
const audio = document.getElementById('audioPlayer');
const playPauseButton =  document.querySelector('.play__button img');
const playerWrapper =  document.querySelector('.player__wrapper');
const playerName =  document.querySelector('.player__name');


//Загружаем данные о треках из локального хранилища при наличии либо инициализируем их
const audioDataList = JSON.parse(localStorage.getItem('audioDataList')) || []
const audioNames = JSON.parse(localStorage.getItem('audioNames')) || [
    "DK feat. Вирус - Ты меня не ищи.mp3",
    "EQRIC, JOZUA, ROBBE - TiK ToK.mp3",
    "EQRIC, Noreal, Muffin - In The Name Of Love.mp3",
    "Geoxor - Virtual.mp3",
    "Harddope, Halvorsen, LexMorris - More Than You Know.mp3",
    "Kavinsky - Nightcall.mp3",
    "NITO-ONNA, MORFI, EQRIC - Hot N Cold.mp3",
    "Paul Engemann - Scarface (Push It To The Limit).mp3"
]

//При отсутствии данных в лкоальном хранилище заполняем массив объектов о треках
if(!audioDataList.length) {
    for (let name of audioNames) {
        const nameArr = name.split(".")
        nameArr.pop()
        const songName = nameArr.join(' ')
        const audioDataItem = {
            name: songName, //Название песни
            src: './audio/' + name, //Путь к файу
            playlists: ['My music'] //В каких плейлистах находится - изначально только в общем
        }
        audioDataList.push(audioDataItem)
    }
}

let currentPlaylist = audioDataList // Данные о песнях текущего плейлиста 
const playlist =  document.querySelector('.playlist');

//Список плейлистов достаем из хранилища либо инициализируем
const playlists = JSON.parse(localStorage.getItem('playlists')) || [{name: 'My music'}]
const playlistsRow =  document.querySelector('.playlists__row');

//Функция создает DOM элемент плейлиста
const createPlaylistItem = (song) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'item__wrapper'
    wrapper.textContent = song.name
    return wrapper
}

//Функция создает кнопку и меню для добавления песен в другие плейлисты
const createAddToPlaylistButton = (song, playlists) => {
    if(playlists.length <= 1) return //Если других плейлистов нет то кнопку не добавляем
    const addToPlaylistButton = document.createElement('button');
    const addToPlaylistIcon = document.createElement('img');
    addToPlaylistIcon.classList.add('points')
    addToPlaylistIcon.src = './assets/points.svg'
    addToPlaylistButton.appendChild(addToPlaylistIcon)
    const addToPlaylist =  document.createElement('select');
    const emptyOption =  document.createElement('option');
    emptyOption.textContent = 'Add to playlist'
    addToPlaylist.appendChild(emptyOption)
    for (let i = 1; i < playlists.length; i++) {
        //Заполняем select вариантами с другими плейлистами
            if(!song.playlists.includes(playlists[i].name)) {
                const addToPlaylistOption =  document.createElement('option');
                addToPlaylistOption.textContent = playlists[i].name
                addToPlaylist.appendChild(addToPlaylistOption)
            }
        }
        //При добавлении песни в другие плейлисты добавляем эту информацию в данные
        //и сохраняем в локальное хранилище
    addToPlaylist.addEventListener('change', () => {
        if(addToPlaylist.value !== 'Добавить в плейлист' 
        && !song.playlists.includes(addToPlaylist.value)) {
            song.playlists.push(addToPlaylist.value)
            localStorage.setItem('audioDataList', JSON.stringify(audioDataList));
        }
    })

    //Обработка нажатий для мобильных устройств
    addToPlaylist.addEventListener('click', (e) => {
        addToPlaylist.classList.remove('opened')
        e.stopPropagation()
    })

    addToPlaylistButton.addEventListener('click', (e) => {
    e.stopPropagation()
    if(!addToPlaylist.classList.contains('opened')) {
        addToPlaylist.classList.add('opened')
    } else {
            addToPlaylist.classList.remove('opened')
        }
    })

    addToPlaylistButton.appendChild(addToPlaylist)
    return addToPlaylistButton
    
}

//Фунция создает кнопку для удаления песни из плейлиста
const createDeleteButton = () => {
    const button = document.createElement('button');
    button.className = 'delete__button'
    const crossImg =  document.createElement('img');
    crossImg.src = './assets/cross.svg'
    button.appendChild(crossImg)
    return button
}

//Функция обновления плейлиста
const updatePlaylist = (item) => {
    //С помощью фильтра выбираем песни выбранного плейлиста
    const playlistSongs = audioDataList.filter(song => song.playlists.includes(item.name))
    currentPlaylist = playlistSongs
    //Для каждой песни создаем DOM элемент
    for(let song of playlistSongs) {
        const itemWrapper = createPlaylistItem(song);
        const buttonsField = document.createElement('div');
        buttonsField.className = 'buttons__field'
        const deleteFromPlaylistButton = createDeleteButton()
        //У каждой песни своя кнопка удаления, при нажатии удаляет имя плейлиста из данных песни
        //и сохраняет обновленные данные в локальное хранилище
        deleteFromPlaylistButton.addEventListener('click', (e) => {
            e.stopPropagation()
            song.playlists = song.playlists.filter(playlist =>  playlist!== item.name)
            localStorage.setItem('audioDataList', JSON.stringify(audioDataList));
            itemWrapper.remove()
        })

        //Наполняем DOM элемент трека кнопками с логикой
        const addToPlaylistButton = createAddToPlaylistButton(song, playlists)
        if(addToPlaylistButton) buttonsField.appendChild(addToPlaylistButton)
        buttonsField.appendChild(deleteFromPlaylistButton)
        itemWrapper.appendChild(buttonsField)
        
        //При нажатии на элемент трека осуществляем логику проигрывания файла
        itemWrapper.addEventListener('click', function () {
            const itemWrappers =  document.querySelectorAll('.item__wrapper');
            playerWrapper.style.display = 'flex'
            //Убираем стили проигрывания для других элементов
            if(playerName.textContent !== song.name) {
                for (let item of itemWrappers) {
                    if(item.classList.contains('playing')) {
                        item.classList.remove('playing')
                    }
                }
                //Меняем данные об источнике для плеера и обновляем интерфейс плеера
                audio.src = song.src;
                audio.play();
                playPauseButton.src = './assets/pause.svg'
                playerName.textContent = song.name
                document.title = song.name
                itemWrapper.classList.add('playing')
            } else {
                //Если нажимаем на один и тот же элемент то исполняем логику как с кнопкной паузы
                if (audio.paused) {
                    audio.play();
                    playPauseButton.src = './assets/pause.svg'
                    itemWrapper.classList.add('playing')
                } else {
                    audio.pause();
                    playPauseButton.src = './assets/play.svg'
                    itemWrapper.classList.remove('playing')
                }

            }
        });
        playlist.appendChild(itemWrapper) 
    }
}

//Функция создает отображение плейлиста в сайдбаре
const createPlaylistBlock = (item) => {
    const playlistWrapper = document.createElement('div')
    playlistWrapper.className = 'playlist__wrapper'

    const playlistTitle = document.createElement('p') 
    playlistTitle.textContent = item.name
    playlistWrapper.appendChild(playlistTitle);

    playlist.replaceChildren();
    updatePlaylist(item)

    //При нажатии исполняем логику изменения текущего плейлиста
    playlistWrapper.addEventListener('click', () => {
        const playlistWrappers =  document.querySelectorAll('.playlist__wrapper');
        for(let item of playlistWrappers) {
            if(item.classList.contains('selected')) {
                item.classList.remove('selected')
            }
        }
        playlistWrapper.classList.add('selected')
        playlist.replaceChildren();
        updatePlaylist(item)
    })

    return playlistWrapper
}

//Изначально для каждого плейлиста из данных создаем свой элемент в DOM
playlists.forEach(item => {
    const block = createPlaylistBlock(item);
    playlistsRow.appendChild(block)
})

//Логика работы кнопок повторного воспроизведения и случайного выбора 
const playlistWrappers =  document.querySelectorAll('.playlist__wrapper');
const repeatButton = document.querySelector('.repeat__button');
const randomButton = document.querySelector('.random__button');
let repeat = false;
let random = false;
playlistWrappers[playlistWrappers.length-1].classList.add('selected')

//При выборе каждого типа воспроизведения меняем переменные которые отвечают за их логику
repeatButton.addEventListener('click', () => {
    repeat = !repeat
    if(random) {
        random = false
        randomButton.classList.remove('player__selected')
    }
    repeatButton.classList.toggle('player__selected')
})

randomButton.addEventListener('click', () => {
    random = !random
    if(repeat) {
        repeat = false
        repeatButton.classList.remove('player__selected')
    }
    randomButton.classList.toggle('player__selected')
})

//При окончании трека в зависимости от типа воспроизведения выбираем следующий трек
audio.addEventListener('ended', function () {
    const currentTrackIndex = currentPlaylist.findIndex(
        item => item.name === playerName.textContent);
    const itemWrappers =  document.querySelectorAll('.item__wrapper');

    for (let item of itemWrappers) {
        if(item.classList.contains('playing')) {
            item.classList.remove('playing')
        }
    }
    //При режиме повторного воспроизведения трек запускается заново
    if(repeat) {
        audio.src = currentPlaylist[currentTrackIndex].src;
        playerName.textContent = currentPlaylist[currentTrackIndex].name
        itemWrappers[currentTrackIndex].classList.add('playing')
    //При режиме случайного воспроизведения запускается случайный трек из текущего плейлиста
    } else if (random) {
        let index
        do {
         index = Math.floor(Math.random() * currentPlaylist.length)
        } while (index === currentTrackIndex)
        console.log(index)
        audio.src = currentPlaylist[index].src;
        playerName.textContent = currentPlaylist[index].name
        itemWrappers[index].classList.add('playing')
    //В обычном режиме запускается следующий трек текущего плейлиста пока он не закончится
    } else if (currentTrackIndex < currentPlaylist.length - 1) {
        audio.src = currentPlaylist[currentTrackIndex+1].src;
        playerName.textContent = currentPlaylist[currentTrackIndex+1].name
        itemWrappers[currentTrackIndex+1].classList.add('playing')
    }
    audio.play();
    playPauseButton.src = './assets/pause.svg'
});

//Логика создания нового плейиста
const addPlaylistInput =  document.querySelector('.playlist__name');
const addPlaylistButton =  document.querySelector('.playlist__add');

//При введенном названии добавляется новый плейлист и данные о нем
//изменения записываются в локальное хранилище
 addPlaylistButton.addEventListener('click', () => {
    if(!addPlaylistInput.value) {
        return
    }
    playlists.push({name: addPlaylistInput.value})
    localStorage.setItem('playlists', JSON.stringify(playlists));

    const block = createPlaylistBlock({name: addPlaylistInput.value});
    playlistsRow.appendChild(block)
    //После добавления отчищаем поле ввода
    addPlaylistInput.value = ''
 })
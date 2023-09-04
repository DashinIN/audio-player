
    const audio = document.getElementById('audioPlayer');
    const playPauseButton =  document.querySelector('.play__button');
    const seekBar = document.querySelector('.time__bar');
    const currentTime =  document.querySelector('.current__time');
    const totalTime =  document.querySelector('.total__time');
    const volumeBar =  document.querySelector('.volume__bar');

    const playerWrapper =  document.querySelector('.player__wrapper');
    const playerName =  document.querySelector('.player__name');

    playPauseButton.addEventListener('click', function () {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = 'Пауза';
        } else {
            audio.pause();
            playPauseButton.innerHTML = 'Воспроизвести';
        }
    });

    audio.addEventListener('timeupdate', function () {
        seekBar.value = audio.currentTime;
        currentTime.innerHTML = formatTime(audio.currentTime);
        totalTime.innerHTML = formatTime(audio.duration);
    });

    seekBar.addEventListener('change', function () {
        audio.currentTime = seekBar.value;
    });

    volumeBar.addEventListener('change', function () {
        audio.volume = volumeBar.value;
    });

   

    function formatTime(seconds) {
        if(seconds) {
            let minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            return minutes + ':' + seconds;
        } else  return '0:00';
    }


const audioDataList = []
const audioNames = [
    "DK feat. Вирус - Ты меня не ищи.mp3",
    "EQRIC, JOZUA, ROBBE - TiK ToK.mp3",
    "EQRIC, Noreal, Muffin - In The Name Of Love.mp3",
    "Geoxor - Virtual.mp3",
    "Harddope, Halvorsen, LexMorris - More Than You Know.mp3",
    "Kavinsky - Nightcall.mp3",
    "NITO-ONNA, MORFI, EQRIC - Hot N Cold.mp3",
    "Paul Engemann - Scarface (Push It To The Limit).mp3"
]

for (let name of audioNames) {
    const nameArr = name.split(".")
    nameArr.pop()
    const songName = nameArr.join(' ')

    const audioDataItem = {
        name: songName,
        src: './audio/' + name,
        playlists: ['Моя музыка']
    }
    audioDataList.push(audioDataItem)
}

const playlist =  document.querySelector('.playlist');

const fileInput =  document.querySelector('.file-input');
const addFileButton = document.querySelector('.form__submit');
const addForm =  document.querySelector('.add__form');

addForm.addEventListener('submit', function (e) {
    e.preventDefault()
    let file = fileInput.files[0];
    if (file) {
            console.log('send')
        }
});


const modal = document.querySelector('.modal');
const openModalButton = document.querySelector('.addItem');
const closeModalButton = document.querySelector('.close');

const openModal = (modal) => {
    document.body.style.overflow = "hidden";
    modal.style.display = 'flex';
}

const closeModal = (modal) => {
    modal.style.display = "none";
    document.body.style.overflow = "";
}

openModalButton.addEventListener('click', () => openModal(modal))
closeModalButton.addEventListener('click', () => closeModal(modal))

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal(modal)
    }
  }


const audioPlayer = document.getElementById('audioPlayer');
const playlists = [{name: 'Моя музыка'}]
const playlistsRow =  document.querySelector('.playlists__row');


const updatePlaylist = (item) => {
    const playlistSongs = audioDataList.filter(song => song.playlists.includes(item.name))
    for(let song of playlistSongs) {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'item__wrapper'
        itemWrapper.textContent = song.name

        const buttonsField = document.createElement('div');
        buttonsField.className = 'buttons__field'


        if(playlists.length > 1) {
            const addToPlaylistButton = document.createElement('button');
            const addToPlaylist =  document.createElement('select');

            const emptyOption =  document.createElement('option');
            emptyOption.textContent = 'Добавить в плейлист'
            addToPlaylist.appendChild(emptyOption)

            for (let i = 1; i < playlists.length; i++) {
                    if(!song.playlists.includes(playlists[i].name)) {
                        const addToPlaylistOption =  document.createElement('option');
                        addToPlaylistOption.textContent = playlists[i].name
                        addToPlaylist.appendChild(addToPlaylistOption)
                    }
                }
            addToPlaylist.addEventListener('change', () => {
                console.log("wow")
                if(addToPlaylist.value !== 'Добавить в плейлист' 
                && !song.playlists.includes(addToPlaylist.value)) {
                    song.playlists.push(addToPlaylist.value)
                    console.log(song.playlists)
                }
            })
            
            addToPlaylistButton.appendChild(addToPlaylist)
            buttonsField.appendChild(addToPlaylistButton)
        }

        const deleteFromPlaylistButton = document.createElement('button');
        deleteFromPlaylistButton.textContent = 'x';
        deleteFromPlaylistButton.addEventListener('click', () => {
            song.playlists = song.playlists.filter(playlist =>  playlist!== item.name)
            console.log(song.playlists)
            console.log(item.name)
            itemWrapper.remove()
        })

        buttonsField.appendChild(deleteFromPlaylistButton)
        itemWrapper.appendChild(buttonsField)
        
        itemWrapper.addEventListener('click', function () {
            playerWrapper.style.display = 'flex'
            playerName.textContent = song.name
            audioPlayer.src = song.src;
            audioPlayer.play();
            playPauseButton.innerHTML = 'Пауза';
        });
        playlist.appendChild(itemWrapper)
    }
}

const createPlaylistBlock = (item) => {
    const playlistWrapper = document.createElement('div')
    playlistWrapper.className = 'playlist__wrapper'

    const playlistTitle = document.createElement('p') 
    playlistTitle.textContent = item.name
    playlistWrapper.appendChild(playlistTitle);

    playlist.replaceChildren();
        updatePlaylist(item)

    playlistWrapper.addEventListener('click', () => {
        playlist.replaceChildren();
        updatePlaylist(item)
    })

    return playlistWrapper
  }

  playlists.forEach(item => {
    const block = createPlaylistBlock(item);
    playlistsRow.appendChild(block)
  })


 const addPlaylistInput =  document.querySelector('.playlist__name');
 const addPlaylistButton =  document.querySelector('.playlist__add');

 addPlaylistButton.addEventListener('click', () => {
    if(!addPlaylistInput.value) {
        return
    }
    playlists.push({name: addPlaylistInput.value})
    const block = createPlaylistBlock({name: addPlaylistInput.value});
    playlistsRow.appendChild(block)

    addPlaylistInput.value = ''
    
 })

const audio = document.getElementById('audioPlayer');
const playPauseButton =  document.querySelector('.play__button img');
const playerWrapper =  document.querySelector('.player__wrapper');
const playerName =  document.querySelector('.player__name');

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

if(!audioDataList.length) {
    for (let name of audioNames) {
        const nameArr = name.split(".")
        nameArr.pop()
        const songName = nameArr.join(' ')
        const audioDataItem = {
            name: songName,
            src: './audio/' + name,
            playlists: ['My music']
        }
        audioDataList.push(audioDataItem)
    }
}

let currentPlaylist = audioDataList
const playlist =  document.querySelector('.playlist');

const playlists = JSON.parse(localStorage.getItem('playlists')) || [{name: 'My music'}]
const playlistsRow =  document.querySelector('.playlists__row');





const createPlaylistItem = (song) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'item__wrapper'
    wrapper.textContent = song.name
    return wrapper
}

const createAddToPlaylistButton = (song, playlists) => {
    if(playlists.length <= 1) return
    const addToPlaylistButton = document.createElement('button');
    const addToPlaylistIcon = document.createElement('img');
    addToPlaylistIcon.classList.add('points')
    addToPlaylistIcon.src = './assets/points.svg'
    addToPlaylistButton.appendChild(addToPlaylistIcon)
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
        if(addToPlaylist.value !== 'Добавить в плейлист' 
        && !song.playlists.includes(addToPlaylist.value)) {
            song.playlists.push(addToPlaylist.value)
            localStorage.setItem('audioDataList', JSON.stringify(audioDataList));
        }
    })

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

const createDeleteButton = () => {
    const button = document.createElement('button');
    button.className = 'delete__button'
    const crossImg =  document.createElement('img');
    crossImg.src = './assets/cross.svg'
    button.appendChild(crossImg)
    return button
}


const updatePlaylist = (item) => {
    const playlistSongs = audioDataList.filter(song => song.playlists.includes(item.name))
    currentPlaylist = playlistSongs
    for(let song of playlistSongs) {
        const itemWrapper = createPlaylistItem(song);
        const buttonsField = document.createElement('div');
        buttonsField.className = 'buttons__field'
        const deleteFromPlaylistButton = createDeleteButton()

        deleteFromPlaylistButton.addEventListener('click', (e) => {
            e.stopPropagation()
            song.playlists = song.playlists.filter(playlist =>  playlist!== item.name)
            localStorage.setItem('audioDataList', JSON.stringify(audioDataList));
            itemWrapper.remove()
        })

        const addToPlaylistButton = createAddToPlaylistButton(song, playlists)
        if(addToPlaylistButton) buttonsField.appendChild(addToPlaylistButton)

        buttonsField.appendChild(deleteFromPlaylistButton)
        itemWrapper.appendChild(buttonsField)
        
        itemWrapper.addEventListener('click', function () {
            const itemWrappers =  document.querySelectorAll('.item__wrapper');
            
            playerWrapper.style.display = 'flex'
            if(playerName.textContent !== song.name) {
                for (let item of itemWrappers) {
                    if(item.classList.contains('playing')) {
                        item.classList.remove('playing')
                    }
                }
                audio.src = song.src;
                audio.play();
                playPauseButton.src = './assets/pause.svg'
                playerName.textContent = song.name
                document.title = song.name
                itemWrapper.classList.add('playing')
            } else {
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

const createPlaylistBlock = (item) => {
    const playlistWrapper = document.createElement('div')
    playlistWrapper.className = 'playlist__wrapper'

    const playlistTitle = document.createElement('p') 
    playlistTitle.textContent = item.name
    playlistWrapper.appendChild(playlistTitle);

    playlist.replaceChildren();
    updatePlaylist(item)

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

playlists.forEach(item => {
    const block = createPlaylistBlock(item);
    playlistsRow.appendChild(block)
})

const playlistWrappers =  document.querySelectorAll('.playlist__wrapper');
console.log(playlistWrappers)
playlistWrappers[playlistWrappers.length-1].classList.add('selected')


audio.addEventListener('ended', function () {
    const currentTrackIndex = currentPlaylist.findIndex(
        item => item.name === playerName.textContent);

    if (currentTrackIndex < currentPlaylist.length - 1) {
        const itemWrappers =  document.querySelectorAll('.item__wrapper');
            for (let item of itemWrappers) {
                if(item.classList.contains('playing')) {
                     item.classList.remove('playing')
                }
            }
            audio.src = currentPlaylist[currentTrackIndex+1].src;
            audio.play();
            playPauseButton.src = './assets/pause.svg'
            playerName.textContent = currentPlaylist[currentTrackIndex+1].name
            itemWrappers[currentTrackIndex+1].classList.add('playing')

    }
});

 const addPlaylistInput =  document.querySelector('.playlist__name');
 const addPlaylistButton =  document.querySelector('.playlist__add');

 addPlaylistButton.addEventListener('click', () => {
    if(!addPlaylistInput.value) {
        return
    }
    
    playlists.push({name: addPlaylistInput.value})
    localStorage.setItem('playlists', JSON.stringify(playlists));

    const block = createPlaylistBlock({name: addPlaylistInput.value});
    playlistsRow.appendChild(block)
    addPlaylistInput.value = ''
 })
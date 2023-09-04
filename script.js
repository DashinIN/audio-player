
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
  const audioFolderURL = 'audio/'
  window.addEventListener('load', function () {
  fetch(audioFolderURL)
  .then(response => response.text())
  .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');
      const links = htmlDoc.querySelectorAll('a');
      
      const fitleredLinks = Array.from(links).slice(3)
      fitleredLinks.forEach(link => {
          const audioDataItem = {
            name: link.title,
            src: audioFolderURL + link.title,
            playlists: ['Моя музыка']
          }
          audioDataList.push(audioDataItem)
      });
  })
  .catch(error => console.error('Ошибка при получении списка аудиофайлов:', error));
  })


  const playlists = [{name: 'Моя музыка'}]
  const playlistsRow =  document.querySelector('.playlists__row');

  const createPlaylistBlock = (item) => {
    const playlistWrapper = document.createElement('div')
    playlistWrapper.className = 'playlist__wrapper'

    const playlistTitle = document.createElement('p') 
    playlistTitle.textContent = item.name
    playlistWrapper.appendChild(playlistTitle);

    playlistWrapper.addEventListener('click', () => {
        playlist.replaceChildren();
        const playlistSongs = audioDataList.filter(song => song.playlists.includes(item.name))
        for(let song of playlistSongs) {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'item__wrapper'
            const nameArr = song.name.split(".")
            nameArr.pop()
            const songName = nameArr.join(' ')
            itemWrapper.textContent = songName
            itemWrapper.addEventListener('click', function () {
                playerWrapper.style.display = 'block'
                playerName.textContent = songName
                audioPlayer.src = song.src;
                audioPlayer.play();
                playPauseButton.innerHTML = 'Пауза';
            });
            playlist.appendChild(itemWrapper)
        }
        
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
    const block = createPlaylistBlock({name: addPlaylistInput.value});
    playlistsRow.appendChild(block)
    addPlaylistInput.value = ''
 })
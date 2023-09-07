
//Логика скрытия и развертывания сайдбара
const sidebar = document.querySelector('.sidebar');
const sidebarToggleButton =  document.querySelector('.sidebar__toggle');
const sidebarToggleIcon =  document.querySelector('.sidebar__toggle img');
const addPlaylistWrapper =  document.querySelector('.addPlaylist__wrapper');

sidebarToggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('closed')
    addPlaylistWrapper.classList.toggle('disabled')
    sidebarToggleIcon.classList.toggle('rotate')
})
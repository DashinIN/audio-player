const fileInput =  document.querySelector('.file-input');
const addFileButton = document.querySelector('.form__submit');
const addForm =  document.querySelector('.add__form');


addForm.addEventListener('submit', e => {
    e.preventDefault()
    let file = fileInput.files[0];
    
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
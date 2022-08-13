import Notiflix from 'notiflix';

const formEl = document.querySelector('#search-form');
const searhBtnEl = document.querySelector('button');
const inputEl = document.querySelector('input');

formEl.addEventListener('submit', onSerchBtn)

function onSerchBtn(e) {
    e.preventDefault()
    console.log(inputEl.value)
    formEl.reset()
}
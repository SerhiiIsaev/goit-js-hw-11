import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.5.min.css";
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('#search-form');
const searhBtnEl = document.querySelector('.search-button');
const inputEl = document.querySelector('input');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery')

let searchName = ""
let page = 1
let restPictures = 0
let perPage = 40
const simplelightbox = new SimpleLightbox('.gallery a');



const onSerchBtn = async(e) => {
    e.preventDefault()
    page = 1
    restPictures = 0
    searchName = inputEl.value
    galleryEl.innerHTML = ""
    loadMoreBtnEl.classList.add('is-hidden')
    try {
        const response = await getData()
        const markup = await createMarkup(response);
        const massage = await makeInfoMassage(response)
        restPictures = await response.data.totalHits - perPage
        simplelightbox.refresh()
    } catch (err) {
        console.log('error')
    }
    formEl.reset();
}

const onLoadMoreBtn = async (e) =>{
    page += 1
    if (restPictures > 0){
        const response = await getData()
        const markup = await createMarkup(response);
        simplelightbox.refresh()
        restPictures -= perPage
    } else {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
    
}

function makeInfoMassage(response) {
    if (response.data.hits.length && searchName) {
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`)
    } else {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
}

function getData() {
    return axios.get(`https://pixabay.com/api/?key=29243564-6faefde78431833ffd5a53afd&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
}

function createMarkup(response) {
    const { data: { hits } } = response;
    if (searchName !== "") {
        const gallery = hits.reduce((acc, item) => acc + createItem(item), "")
        galleryEl.insertAdjacentHTML("beforeend", gallery)
        loadMoreBtnEl.classList.remove('is-hidden')
    }
         
    if (searchName === "" || hits.length === 0) {
        loadMoreBtnEl.classList.add('is-hidden')
        
    }
}

function createItem(item) {
    return `<div class="photo-card"><a href="${item.largeImageURL}"><img src="${item.webformatURL}" width="400" height="300" alt="${item.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: <span class="info-value">${item.likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views: <span class="info-value">${item.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments: <span class="info-value">${item.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads: <span class="info-value">${item.downloads}</span></b>
    </p>
  </div>
</div>`
}


formEl.addEventListener('submit', onSerchBtn)
loadMoreBtnEl.addEventListener('click', onLoadMoreBtn)
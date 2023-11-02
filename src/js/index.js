
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector(".search-input");
const submitButton = document.querySelector(".submit-button");
const loadMoreButton = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

const perPage = 40;
let page = 1;
let inputValue;

const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
});

function getImages (q, page) { 
    return axios({
        method: 'get',
        url: `https://pixabay.com/api/?key=40315175-cc9353fc56e9f03e64344f082&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`,
    })
}

submitButton.addEventListener("click", async (evt) => {
    evt.preventDefault();
    page = 1;
    loadMoreButton.classList.add("visually-hidden");
    const { data } = await getImages(input.value, page);
    const markup = createMarkUp(data);
    loadMoreButton.classList.remove("visually-hidden");

    if (data.hits.length === 0 || !input.value) { 
        loadMoreButton.classList.add("visually-hidden");
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    };

    if (inputValue !== input.value) {
        inputValue = input.value;
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    gallery.innerHTML = markup;
    lightbox.refresh();
}) 
 
loadMoreButton.addEventListener("click", async (evt) => {
    page += 1;
    const { data } = await getImages(input.value, page);
    const markup = createMarkUp(data);

    gallery.innerHTML = gallery.innerHTML + markup;
    lightbox.refresh();
    
    if (page * perPage >= data.totalHits) {
        loadMoreButton.classList.add("visually-hidden");
        Notify.info("We're sorry, but you've reached the end of search results.");    
    }
})

function createMarkUp(data) {
    return data.hits.map(image => {
        return `<li class="photo-card">
            <a class="photo-link" href="${image.largeImageURL}">
                <img class="image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                <div class="info-wrap">
                    <div class="info-item">
                        <b class="title">Likes</b>
                        <p class="text">${image.likes}<p/>
                    </div>

                    <div class="info-item">
                        <b class="title">Views</b>
                        <p class="text">${image.views}<p/>
                    </div>

                    <div class="info-item">
                        <b class="title">Comments</b>
                        <p class="text">${image.comments}<p/>
                    </div>

                    <div class="info-item">
                        <b class="title">Downloads</b>
                        <p class="text">${image.downloads}<p/>
                    </div>
                </div>
            </a>
        </li>`;
        }).join("");
}

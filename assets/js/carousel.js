
const track = document.querySelector('#testimonial-carousel-multi .carousel-track');
const slides = document.querySelectorAll('#testimonial-carousel-multi .carousel-slide');
const prevBtn = document.querySelector('#testimonial-carousel-multi .carousel-btn.prev');
const nextBtn = document.querySelector('#testimonial-carousel-multi .carousel-btn.next');
let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

prevBtn.onclick = () => {
index = (index - 1 + slides.length) % slides.length;
updateCarousel();
};
nextBtn.onclick = () => {
index = (index + 1) % slides.length;
updateCarousel();
};

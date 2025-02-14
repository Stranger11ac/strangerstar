const swiperElement = document.querySelector(".swiper");
const defaultInterval = 9000;
const swiperInterval = parseInt(swiperElement.getAttribute("data-interval"), 10) || defaultInterval;

// Configuración de Swiper
const swiper = new Swiper(swiperElement, {
    slidesPerView: 1,
    spaceBetween: 15,
    loop: true,
    keyboard: { enabled: true },
    mousewheel: { invert: false },
    autoplay: { delay: swiperInterval, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    // navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    // },
    on: {
        autoplayTimeLeft(s, time, progress) {
            const clampedProgress = Math.max(0, Math.min(progress, 1));
            const progressPercent = Math.round((1 - clampedProgress) * 100);
            const bulletActive = document.querySelector(".swiper-pagination-bullet-active");
            if (bulletActive) {
                bulletActive.style.setProperty("--progress", `${progressPercent}%`);
            }
        },
    },
});

// Pausar autoplay al hacer touch o hover
swiperElement.addEventListener("touchstart", swiperStop);
swiperElement.addEventListener("mouseenter", swiperStop);
// Reanudar autoplay al finalizar touch o quitar el hover
swiperElement.addEventListener("touchend", swiperStart);
swiperElement.addEventListener("mouseleave", swiperStart);

// Funciones para pausar y reanudar autoplay
function swiperStop() {
    swiper.autoplay.stop();
}

function swiperStart() {
    swiper.autoplay.start();
}

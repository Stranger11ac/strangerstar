$(document).ready(function () {
    // Inicializar o cargar likes desde localStorage
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];

    // Configurar los iconos y contadores al cargar la página
    $(".post").each(function () {
        const post = $(this);
        const postId = post.data("id");
        const likeIcon = post.find(".like-icon");
        const likeCountEl = post.find(".like-count");
        const likes = parseInt(post.data("likes"), 10);

        likeCountEl.text(formatLikes(likes));
        if (likedPosts.includes(postId)) {
            likeIcon.addClass("heart-angle-bold").removeClass("heart-angle-broken");
        }
    });

    // Detectar doble clic/doble toque
    $(".post").on("dblclick", function () {
        const post = $(this);
        const postId = post.data("id");
        const likeIcon = post.find(".like-icon");
        const likeCountEl = post.find(".like-count");

        // Verificar si el post ya fue likeado
        if (!likedPosts.includes(postId)) {
            likedPosts.push(postId);
            localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
            const currentLikes = parseInt(post.data("likes"), 10) + 1;
            post.data("likes", currentLikes);
            likeCountEl.text(formatLikes(currentLikes));
        }

        // Mostrar el icono de like con animación
        likeIcon.addClass("active heart-angle-bold").removeClass("heart-angle-broken");
        setTimeout(() => {
            likeIcon.removeClass("active");
        }, 800);
    });

    // Función para formatear los números como "3K" o "2M"
    function formatLikes(number) {
        if (number >= 1000000000) {
            return "+" + Math.floor(number / 1000000000) + "KM";
        } else if (number >= 1000000) {
            return Math.floor(number / 1000000) + "M";
        } else if (number >= 1000) {
            return Math.floor(number / 1000) + "K";
        } else {
            return number.toString();
        }
    }
});

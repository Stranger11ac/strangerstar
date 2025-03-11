function startIntro() {
    introJs()
        .setOptions({
            steps: [
                {
                    intro: "Bienvenido al tutorial interactivo con Intro.js.",
                },
                {
                    element: "#upList",
                    intro: "Haz clic en este botón si quieres repetir el tutorial.",
                },
            ],
            showBullets: true,
            nextLabel: '<i class="ic-solar alt-arrow-right"></i>',
            prevLabel: '<i class="ic-solar alt-arrow-left"></i>',
            doneLabel: '<i class="ic-solar check-circle-bold-duotone"></i>',
        })
        .oncomplete(function () {
            localStorage.setItem("viewIntro", "true");
        })
        .onexit(function () {
            localStorage.setItem("viewIntro", "true");
        })
        .start();
}

// if (!localStorage.getItem("viewIntro")) {
//     startIntro();
// }
    startIntro();

// document.getElementById("startTour").addEventListener("click", function () {
//     localStorage.removeItem("viewIntro");
//     startIntro();
// });

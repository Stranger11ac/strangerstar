function startIntro() {
    introJs()
        .setOptions({
            steps: [
                {
                    intro: "Esta es la ruleta interactiva de Stranger Star.",
                },
                {
                    element: "#newOption",
                    intro: "Agrega Nuevas opciones a la lista actual.",
                },
                {
                    element: "#upList",
                    intro: "Sube una lista nueva seleccionando un archivo Excel.",
                },
                {
                    element: "#historyBtn",
                    intro: "Cada resultado se Guarda temporalmente.",
                },
                {
                    intro: "Listo! Disfruta el juego!",
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

if (!localStorage.getItem("viewIntro")) {
    startIntro();
}

document.getElementById("startTour").addEventListener("click", function () {
    localStorage.removeItem("viewIntro");

    setTimeout(() => {
        startIntro();
    }, 2000);
});

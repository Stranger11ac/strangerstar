function spinIntro() {
    introJs()
        .setOptions({
            steps: [
                {
                    title: "Bienvenidos 👋😋",
                    intro: "Esta es la ruleta interactiva. Te recomiendo hacer este pequeño tutorial. <i class='ic-solar play-circle'></i>",
                },
                {
                    element: "#groupNewOp",
                    intro: "Agrega nuevas opciones a la lista actual. <i class='ic-solar donut-bitten'></i>",
                },
                {
                    element: "#upList",
                    intro: "Sube una lista nueva seleccionando un archivo Excel. <i class='ic-solar folder-cut'></i><i class='ic-solar file-send-bold-duotone'></i>",
                },
                {
                    element: "#historyBtn",
                    intro: "Cada resultado se Guarda temporalmente. <i class='ic-solar history-line-duotone'></i>",
                },
                {
                    intro: "Listo!!! 🎉🎉🎉 <br/> Disfruta el juego! 😋👋 <br/> Puedes repetir el tutorial en las configuraciones. <i class='ic-solar settings'></i>",
                },
            ],
            showBullets: true,
            nextLabel: '<i class="ic-solar alt-arrow-right"></i>',
            prevLabel: '<i class="ic-solar alt-arrow-left"></i>',
            doneLabel: '<i class="ic-solar check-circle-bold-duotone"></i>',
        })
        .start()
        .onexit(function () {
            localStorage.setItem("viewSpinIntro", "true");
        });
}

if (!localStorage.getItem("viewSpinIntro")) {
    spinIntro();
}

document.getElementById("startTour").addEventListener("click", function () {
    localStorage.removeItem("viewSpinIntro");

    setTimeout(() => {
        spinIntro();
    }, 2000);
});

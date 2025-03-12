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
        .onexit(function () {
            localStorage.setItem("viewSpinIntro", "true");
        })
        .start();
}

if (!localStorage.getItem("viewSpinIntro")) {
    spinIntro();
}

$("#startSpinTour").on("click", function () {
    localStorage.removeItem("viewSpinIntro");

    setTimeout(() => {
        spinIntro();
    }, 2000);
});

function weatherIntro() {
    introJs()
        .setOptions({
            steps: [
                {
                    title: "Bienvenidos 👋😋",
                    intro: "Esta app de clima es sencilla. Te recomiendo hacer este pequeño tutorial. <i class='ic-solar cloud-sun-bold-duotone'></i>",
                },
                {
                    title: "Advertencia 😥⚠️🧐",
                    intro: "Los datos de esta app no son presizos ya que son datos publicos y gratuitos de <a href='weatherapi.com' target='_blank' rel='noopener noreferrer'>weatherapi.com</a> <i class='ic-solar confounded-circle-bold-duotone'></i>",
                },
                {
                    element: "#searchCoords",
                    intro: "Puedes buscar el clima en tu ubicacion actual <i class='ic-solar gps-bold-duotone'></i>, al permitir el acceso a tu ubicacion los datos no son compartidos, solamente se utilizan para mostarte el clima de la ciudad actual.",
                },
                {
                    element: "#locationGroup",
                    intro: "Escribe en el campo para buscar el clima de una ciudad en concreto <i class='ic-solar map-point-search'></i>. Tu busqueda puede ser mas precisa al incluir el estado o provincia para ser mas especifico",
                },
                {
                    element: "#btnLocation",
                    intro: "Despues de escribir la localidad puedes presionar 'Enter' o hacer click en este boton. <i class='ic-solar minimalistic-magnifer'></i>",
                },
                {
                    intro: "Los datos del clima se actualizan solamente con una nueva busqueda pero los datos anteriores persisten hasta que se elimine el cache. <i class='ic-solar settings'></i> <i class='ic-solar server-square-update'></i>",
                },
                {
                    intro: "Listo!!! 🎉🎉🎉😋👋 <br/> Puedes repetir el tutorial en las configuraciones. <i class='ic-solar settings'></i>",
                },
            ],
            showBullets: true,
            nextLabel: '<i class="ic-solar alt-arrow-right"></i>',
            prevLabel: '<i class="ic-solar alt-arrow-left"></i>',
            doneLabel: '<i class="ic-solar check-circle-bold-duotone"></i>',
        })
        .onexit(function () {
            localStorage.setItem("viewWeatherIntro", "true");
        })
        .start();
}

if (!localStorage.getItem("viewWeatherIntro")) {
    weatherIntro();
}

$("#startWeatherTour").on("click", function () {
    localStorage.removeItem("viewWeatherIntro");

    setTimeout(() => {
        weatherIntro();
    }, 2000);
});

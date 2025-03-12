function startIntro(introKey, steps) {
    const introState = JSON.parse(localStorage.getItem("introState")) || {};
    introJs()
        .setOptions({
            steps,
            showBullets: true,
            nextLabel: '<i class="ic-solar alt-arrow-right"></i>',
            prevLabel: '<i class="ic-solar alt-arrow-left"></i>',
            doneLabel: '<i class="ic-solar check-circle-bold-duotone"></i>',
        })
        .onexit(() => {
            introState[introKey] = true;
            localStorage.setItem("introState", JSON.stringify(introState));
        })
        .start();
}

const spinSteps = [
    { title: "Bienvenidos 👋😋", intro: "Esta es la ruleta interactiva. Te recomiendo hacer este pequeño tutorial. <i class='ic-solar play-circle'></i>" },
    { element: "#groupNewOp", intro: "Agrega nuevas opciones a la lista actual. <i class='ic-solar donut-bitten'></i>" },
    { element: "#upList", intro: "Sube una lista nueva seleccionando un archivo Excel. <i class='ic-solar folder-cut'></i><i class='ic-solar file-send-bold-duotone'></i>" },
    { element: "#historyBtn", intro: "Cada resultado se Guarda temporalmente. <i class='ic-solar history-line-duotone'></i>" },
    { intro: "Listo!!! 🎉🎉🎉 <br/> Disfruta el juego! 😋👋 <br/> Puedes repetir el tutorial en las configuraciones. <i class='ic-solar settings'></i>" },
];

const weatherSteps = [
    { title: "Bienvenidos 👋😋", intro: "Esta app de clima es sencilla. Te recomiendo hacer este pequeño tutorial. <i class='ic-solar cloud-sun-bold-duotone'></i>" },
    {
        title: "Advertencia 😥⚠️🧐",
        intro: "Los datos de esta app no son precisos ya que son datos públicos y gratuitos de <a href='weatherapi.com' target='_blank' rel='noopener noreferrer'>weatherapi.com</a> <i class='ic-solar confounded-circle-bold-duotone'></i>",
    },
    {
        element: "#searchCoords",
        intro: "Puedes buscar el clima en tu ubicación actual <i class='ic-solar gps-bold-duotone'></i>, al permitir el acceso a tu ubicación los datos no son compartidos, solamente se utilizan para mostrarte el clima de la ciudad actual.",
    },
    {
        element: "#locationGroup",
        intro: "Escribe en el campo para buscar el clima de una ciudad en concreto <i class='ic-solar map-point-search'></i>. Tu búsqueda puede ser más precisa al incluir el estado o provincia.",
    },
    { element: "#btnLocation", intro: "Después de escribir la localidad puedes presionar 'Enter' o hacer clic en este botón. <i class='ic-solar minimalistic-magnifer'></i>" },
    {
        intro: "Los datos del clima se actualizan solamente con una nueva búsqueda pero los datos anteriores persisten hasta que se elimine el caché. <i class='ic-solar settings'></i> <i class='ic-solar server-square-update'></i>",
    },
    { intro: "Listo!!! 🎉🎉🎉😋👋 <br/> Puedes repetir el tutorial en las configuraciones. <i class='ic-solar settings'></i>" },
];

const introState = JSON.parse(localStorage.getItem("introState")) || {};
const bodyIntro = $('body').attr("data-intro")

switch (bodyIntro) {
    case "viewSpinIntro":
        if (!introState.viewSpinIntro) startIntro("viewSpinIntro", spinSteps);
        break;
    case "viewWeatherIntro":
        if (!introState.viewWeatherIntro) startIntro("viewWeatherIntro", weatherSteps);
        break;
    default:
        break;
}

$("#startSpinTour").on("click", () => {
    introState.viewSpinIntro = false;
    localStorage.setItem("introState", JSON.stringify(introState));
    setTimeout(() => startIntro("viewSpinIntro", spinSteps), 2000);
});

$("#startWeatherTour").on("click", () => {
    introState.viewWeatherIntro = false;
    localStorage.setItem("introState", JSON.stringify(introState));
    setTimeout(() => startIntro("viewWeatherIntro", weatherSteps), 2000);
});

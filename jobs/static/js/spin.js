$(document).ready(function () {
    let options = ["Opción 1", "Opción 2", "Opción 3", "Opción 4", "Opción 5", "Opción 6", "Opción 7", "Opción 8", "Opción 9", "Opción 10"];

    let activeOptions = [...options];
    let canvas = document.getElementById("rouletteCanvas");
    let ctx = canvas.getContext("2d");
    let angle = 0;

    function drawRoulette(rotAngle = 0) {
        let totalOptions = activeOptions.length;
        let arcSize = (2 * Math.PI) / totalOptions;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(rotAngle);

        for (let i = 0; i < totalOptions; i++) {
            let startAngle = i * arcSize;
            let endAngle = startAngle + arcSize;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 150, startAngle, endAngle);
            ctx.fillStyle = `hsl(${i * (360 / totalOptions)}, 100%, 50%)`;
            ctx.fill();
            ctx.stroke();

            // Dibujar texto
            ctx.save();
            ctx.rotate(startAngle + arcSize / 2);
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(activeOptions[i], 70, 5);
            ctx.restore();
        }

        ctx.restore();
    }

    function renderOptions() {
        $("#optionList").empty();
        options.forEach((option) => {
            let checked = activeOptions.includes(option) ? "" : "checked";
            let tachado = checked ? "tachado" : "";
            $("#optionList").append(`
                <li>
                    <input type="checkbox" class="toggle-option" data-option="${option}" ${checked}>
                    <span class="${tachado}">${option}</span>
                    <button class="delete-btn" data-option="${option}">X</button>
                </li>
            `);
        });
        drawRoulette();
    }

    renderOptions();

    // Girar la ruleta
    $("#spin").click(function () {
        if (activeOptions.length === 0) {
            alert("No hay opciones disponibles.");
            return;
        }

        let randomIndex = Math.floor(Math.random() * activeOptions.length);
        let arcSize = (2 * Math.PI) / activeOptions.length;
        let targetAngle = randomIndex * arcSize + Math.PI / activeOptions.length;
        let extraSpins = Math.floor(Math.random() * 10 + 5);
        let finalAngle = extraSpins * 2 * Math.PI + targetAngle;

        let startTime = null;
        function animateRotation(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = (timestamp - startTime) / 3000;
            angle = progress * finalAngle;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRoulette(angle);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                let selectedOption = activeOptions[randomIndex];
                // alert(`La opción seleccionada es: ${selectedOption}`);
                $("#result").text(`Resultado: ${selectedOption}`);
            }
        }

        requestAnimationFrame(animateRotation);
    });

    // Agregar nueva opción
    $("#addOption").click(function () {
        let newOption = $("#newOption").val().trim();
        if (newOption && !options.includes(newOption)) {
            options.push(newOption);
            activeOptions.push(newOption);
            renderOptions();
            $("#newOption").val("");
        } else {
            alert("La opción ya existe o está vacía.");
        }
    });

    // Eliminar opción
    $(document).on("click", ".delete-btn", function () {
        let option = $(this).data("option");
        options = options.filter((o) => o !== option);
        activeOptions = activeOptions.filter((o) => o !== option);
        renderOptions();
    });

    // Marcar/desmarcar opción
    $(document).on("change", ".toggle-option", function () {
        let option = $(this).data("option");
        if ($(this).is(":checked")) {
            activeOptions = activeOptions.filter((o) => o !== option);
        } else {
            activeOptions.push(option);
        }
        renderOptions();
    });
});

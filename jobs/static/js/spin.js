var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose", "$1000000", "Lose", "$350", "$5", "$99"];
var hiddenOptions = new Set(); // Almacena opciones ocultas

var startAngle = 0;
var arc;
var spinTimeout = null;
var spinAngleStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;

document.getElementById("spin").addEventListener("click", spin);

function getFilteredOptions() {
    return options.filter((opt) => !hiddenOptions.has(opt)); // Excluye opciones ocultas
}

function getColor(index, max) {
    var phase = 0,
        center = 128,
        width = 127;
    var frequency = (Math.PI * 2) / max;
    var red = Math.sin(frequency * index + 2 + phase) * width + center;
    var green = Math.sin(frequency * index + 0 + phase) * width + center;
    var blue = Math.sin(frequency * index + 4 + phase) * width + center;
    return `rgb(${Math.round(red)},${Math.round(green)},${Math.round(blue)})`;
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    var size = canvas.width;
    var ctx = canvas.getContext("2d");

    var outsideRadius = size * 0.4;
    var textRadius = size * 0.32;
    var insideRadius = size * 0.25;

    ctx.clearRect(0, 0, size, size);
    ctx.font = `${Math.max(12, size * 0.03)}px Helvetica, Arial`; // Escala el tamaño del texto

    var filteredOptions = getFilteredOptions();
    arc = Math.PI / (filteredOptions.length / 2);

    for (var i = 0; i < filteredOptions.length; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, filteredOptions.length);

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, outsideRadius, angle, angle + arc, false);
        ctx.arc(size / 2, size / 2, insideRadius, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.translate(size / 2 + Math.cos(angle + arc / 2) * textRadius, size / 2 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        var text = filteredOptions[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }

    // Flecha
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(size / 2 - 5, size / 2 - (outsideRadius + 5));
    ctx.lineTo(size / 2 + 5, size / 2 - (outsideRadius + 5));
    ctx.lineTo(size / 2 + 5, size / 2 - (outsideRadius - 8));
    ctx.lineTo(size / 2 + 10, size / 2 - (outsideRadius - 8));
    ctx.lineTo(size / 2 + 0, size / 2 - (outsideRadius - 20));
    ctx.lineTo(size / 2 - 10, size / 2 - (outsideRadius - 8));
    ctx.lineTo(size / 2 - 5, size / 2 - (outsideRadius - 8));
    ctx.lineTo(size / 2 - 5, size / 2 - (outsideRadius + 5));
    ctx.fill();
}

function spin() {
    spinAngleStart = Math.random() * 150;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI) / 180;
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var filteredOptions = getFilteredOptions();
    var degrees = (startAngle * 180) / Math.PI + 90;
    var arcd = (arc * 180) / Math.PI;
    var index = Math.floor((360 - (degrees % 360)) / arcd);
    var response = filteredOptions[index];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var size = canvas.width;

    ctx.save();
    ctx.font = `${Math.max(20, size * 0.05)}px Helvetica, Arial`; // Ajusta el tamaño del texto
    ctx.fillStyle = "#fff";
    ctx.fillText(response, size / 2 - ctx.measureText(response).width / 2, size / 2 + 8);
    ctx.restore();
    document.getElementById("resultado").textContent = "Resultado: " + response;
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t,
        tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();

document.getElementById("addOptionForm").addEventListener("submit", addOption);
function addOption(event) {
    event.preventDefault();
    var newOption = document.getElementById("newOption").value;
    if (newOption) {
        options.push(newOption);
        updateOptionsList();
        drawRouletteWheel();
    }
}

function updateOptionsList() {
    var list = document.getElementById("optionsList");
    list.innerHTML = "";
    options.forEach((option, index) => {
        var li = document.createElement("li");

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = hiddenOptions.has(option);
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                li.classList.add("subrayado");
                hiddenOptions.add(option);
            } else {
                li.classList.remove("subrayado");
                hiddenOptions.delete(option);
            }
            drawRouletteWheel();
        });

        var text = document.createTextNode(" " + option + " ");

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", function () {
            options.splice(index, 1);
            hiddenOptions.delete(option);
            updateOptionsList();
            drawRouletteWheel();
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

updateOptionsList();

function resizeCanvas() {
    var canvas = document.getElementById("canvas");
    var container = canvas.parentElement;

    // Ajusta el tamaño del canvas al contenedor o a un tamaño máximo deseado
    var size = Math.min(container.clientWidth, container.clientHeight, 500); // Máximo 500px para mantener proporción
    canvas.width = size;
    canvas.height = size;

    drawRouletteWheel(); // Redibujar la ruleta después de cambiar el tamaño
}

// Llamar a la función en la carga y cuando se redimensiona la ventana
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

var options = [
    "$100", "$10","$25",
    "$250", "$30", "$1000",
    "$1", "$200", "$45",
    "$500", "$5", "$20",
    "$1000000", "$350", "$99",
    "Lose"
];
var hiddenOptions = new Set(); // Almacena opciones ocultas

var startAngle = 0;
var arc;
var spinTimeout = null;
var spinAngleStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;

const btnSpin = document.getElementById("spin");
btnSpin.addEventListener("click", function () {
    this.classList.add("hide");
    spin();
});

function getFilteredOptions() {
    return options.filter((opt) => !hiddenOptions.has(opt));
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

    setTimeout(() => {
        btnSpin.classList.remove("hide");
    }, 2500);
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

    event.target.reset();
}

function updateOptionsList() {
    var list = document.getElementById("optionsList");
    list.innerHTML = "";
    options.forEach((option, index) => {
        var div = document.createElement("div");
        div.classList = "flexbox a-center p-5 w100";

        var li = document.createElement("li");
        li.classList = "flexbox between a-center bg-bgcolor hover-detail radius";

        var label = document.createElement("label");
        label.textContent = option;
        label.classList = "w100";
        label.htmlFor = option;

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = option;
        checkbox.checked = hiddenOptions.has(option);
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                label.classList.add("line-through", "opacity");
                hiddenOptions.add(option);
            } else {
                label.classList.remove("line-through", "opacity");
                hiddenOptions.delete(option);
            }
            drawRouletteWheel();
        });

        var deleteButton = document.createElement("button");
        deleteButton.classList = "btn-invert btn-icon hover-red";
        deleteButton.innerHTML = "<span class='ic-solar trash-bin-trash'></span>";
        deleteButton.addEventListener("click", function () {
            options.splice(index, 1);
            hiddenOptions.delete(option);
            updateOptionsList();
            drawRouletteWheel();
        });

        div.appendChild(checkbox);
        div.appendChild(label);
        li.appendChild(div);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

updateOptionsList();

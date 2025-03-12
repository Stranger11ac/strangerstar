var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "$1000000", "$350", "$99", "Lose"];
var hiddenOptions = new Set();
var lastOption = 0;
var counter = 1;

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
    ctx.font = `${Math.max(20, size * 0.1)}px Helvetica, Arial`;

    const getTheme = localStorage.getItem("theme");
    if (getTheme == "light") {
        ctx.fillStyle = "#333";
    } else {
        ctx.fillStyle = "#fff";
    }

    ctx.fillText(response, size / 2 - ctx.measureText(response).width / 2, size / 2 + 12);
    ctx.restore();

    var list = document.getElementById("history");
    var li = document.createElement("li");
    var date = document.createElement("div");
    var result = document.createElement("div");

    var now = new Date();
    var formattedDate = now.toLocaleString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    li.classList = "p-10";
    date.innerHTML = `<span class="count">${counter}</span> ${formattedDate}`;
    date.classList = "hostory_date";
    result.textContent = response;
    counter++;

    li.appendChild(date);
    li.appendChild(result);
    list.appendChild(li);

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
        var li = document.createElement("li");
        var label = document.createElement("label");

        div.classList.add("w100");
        div.id = `op${index}`;
        label.textContent = option;
        label.classList.add("w100");
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
        deleteButton.classList.add("btn-invert", "btn-icon", "hover-red");
        deleteButton.innerHTML = "<span class='ic-solar trash-bin-trash'></span>";
        deleteButton.id = `delBtn${index}`;
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

    // list.setAttribute("data-optionsLenght", options.length - 1);
    // lastOption = options.length - 1;
}

var fileInput = document.getElementById("fileList");
fileInput.addEventListener("change", function () {
    var sendFile = fileInput.getAttribute("data-post");
    var file = fileInput.files[0];
    var toastTime = 8000;

    if (!file) {
        toast("center", toastTime, "error", "Selecciona un archivo Excel primero.");
        return;
    }

    var allowedExtensions = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!allowedExtensions.includes(file.type)) {
        toast("center", toastTime, "error", "Solo se permiten archivos Excel (.xls, .xlsx).");
        fileInput.value = "";
        return;
    }

    var formData = new FormData();
    formData.append("file", file);

    fetch(sendFile, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                options = [...data.options];
                updateOptionsList();
                drawRouletteWheel();

                toast("top-end", 3000, "success", "Se subió una lista correctamente");
            } else {
                toast("center", toastTime, "error", "Error al procesar el archivo: " + data.error);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            toast("center", toastTime, "error", "Hubo un problema al subir el archivo.");
        });
});

updateOptionsList();

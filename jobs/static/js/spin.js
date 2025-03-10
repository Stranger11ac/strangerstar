var options2 = ["$100", "$5"];
var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose", "$1000000", "Lose", "$350", "$5", "$99"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinAngleStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return nybHexString[(n >> 4) & 0x0f] + nybHexString[n & 0x0f];
}

function RGB2Color(r, g, b) {
    return "#" + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = (Math.PI * 2) / maxitem;

    var red = Math.sin(frequency * item + 2 + phase) * width + center;
    var green = Math.sin(frequency * item + 0 + phase) * width + center;
    var blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);
        ctx.font = "bold 12px Helvetica, Arial";

        for (var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(250 - 5, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 5, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 5, 250 - (outsideRadius - 8));
        ctx.lineTo(250 + 10, 250 - (outsideRadius - 8));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 20));
        ctx.lineTo(250 - 10, 250 - (outsideRadius - 8));
        ctx.lineTo(250 - 5, 250 - (outsideRadius - 8));
        ctx.lineTo(250 - 5, 250 - (outsideRadius + 5));
        ctx.fill();
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
    var degrees = (startAngle * 180) / Math.PI + 90;
    var arcd = (arc * 180) / Math.PI;
    var index = Math.floor((360 - (degrees % 360)) / arcd);
    ctx.save();
    ctx.font = "bold 30px Helvetica, Arial";
    var response = options[index];
    ctx.fillText(response, 250 - ctx.measureText(response).width / 2, 250);
    ctx.restore();
    document.getElementById("resultado").textContent = "Resultado: " + response;
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
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
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                li.classList.add("subrayado");
            } else {
                li.classList.remove("subrayado");
            }
        });

        var text = document.createTextNode(" " + option + " ");

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", function () {
            options.splice(index, 1);
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

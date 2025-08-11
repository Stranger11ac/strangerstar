$(document).on("keydown", function (e) {
    if (e.key === "Escape") {
        if (Swal.isVisible()) {
            Swal.close();
        }
    }
});

$(document).ready(function () {
    // Body Visibility ###################################################################
    setTimeout(() => {
        $("body").removeClass("unload");
        setTimeout(() => {
            $("body").addClass("load");
        }, 500);
    }, 500);

    // Search - filter ###################################################################
    var searchInput = $("#searchInput");
    searchInput.on("input", filtertable);
    function filtertable() {
        var value = searchInput.val().toLowerCase();
        $(".searchBox")
            .children()
            .filter(function () {
                $(this).toggle($(this).attr("data-copy").toLowerCase().indexOf(value) > -1);
                return $(this).is(":visible");
                return $(this).addClass("blue");
            }).length;
    }
    $("[data-clear]").click(function () {
        const clearInput = $(this).attr("data-clear");
        $("#" + clearInput)
            .val("")
            .focus();
        $(".searchBox")
            .children()
            .each(function () {
                $(this).show();
                $(this).show().removeClass("blue");
            });
    });

    // Remove object ######################################################################
    $("[data-remove]").click(function () {
        const selectObj = $(this).attr("data-remove");
        $(`${selectObj}`).remove();
        let removedObjects = JSON.parse(localStorage.getItem("removedObjects")) || [];

        if (!removedObjects.includes(selectObj)) {
            removedObjects.push(selectObj);
        }

        localStorage.setItem("removedObjects", JSON.stringify(removedObjects));
    });

    const removedObjects = JSON.parse(localStorage.getItem("removedObjects")) || [];
    removedObjects.forEach((selector) => {
        $(selector).remove();
    });

    // Toggle object ######################################################################
    $("[data-toggle]").click(function () {
        const selectorClass = $(this).attr("data-toggle");
        const parts = selectorClass.split("-");
        const partsSelector = parts[0];
        const partsClass = parts[1];

        const partsFunction = parts[2];
        $(partsSelector).toggleClass(partsClass);

        if (partsClass && partsClass != "none") {
            $(".overlay").toggleClass(partsClass);
        }

        if (partsFunction && partsFunction == "slide") {
            const partsObject = parts[3];
            $(partsObject).slideToggle("fast");

            $(".overlay").attr("data-close", function (i, attr) {
                if (attr === "") {
                    return selectorClass;
                } else if (attr === selectorClass) {
                    return "";
                }
            });
        } else if (partsFunction && partsFunction == "modal") {
            $(".overlay").attr("data-second", function (i, attr) {
                return attr === selectorClass ? "" : selectorClass;
            });
        }
    });

    // Close objects ######################################################################
    $("[data-close]").click(function () {
        closeOverlay(this, "data-close");
    });
    $("[data-second]").click(function () {
        closeOverlay(this, "data-second");
    });

    function closeOverlay(element, thisDataSelector) {
        const dataSelector = $(element).attr(thisDataSelector);
        if (!dataSelector) return; // Prevenir errores si dataSelector es undefined

        const parts = dataSelector.split("-");
        const partsSelector = parts[0];
        const partsClass = parts[1];
        const partsFunction = parts[2];

        if (partsFunction && partsFunction === "slide") {
            const partsObject = parts[3];
            $("#" + partsObject).slideToggle("fast");
        }

        $(element).removeClass(partsClass).attr(thisDataSelector, "");
        $(partsSelector).removeClass(partsClass);
    }

    // Switch ######################################################################
    function updateTheme(themeId) {
        const [idTheme, idName] = themeId.split("-");
        $("html").attr("data-theme", idTheme);
        $("#modalSettings #themeName").text(idName);
        localStorage.setItem("theme", idTheme);
    }
    function updateMenu(menuId) {
        const $settingsModal = $("#modalSettings");
        const $btnPosition = localStorage.getItem("btn_settings");

        $("body").attr("data-menu-direction", menuId);
        $settingsModal.find("#textDirection").text(menuId);
        localStorage.setItem("menu_direction", menuId);

        const addLeftClass = menuId === "vertical" && $btnPosition !== "window";
        $settingsModal.toggleClass("modal_left", addLeftClass);
    }
    function updateSettings(settingsId) {
        const [idBtnDirection, idBtnText] = settingsId.split("-");
        const $linkSettings = $(".link_settings");
        const $settingsBox = $(".settings_box");
        const $settingsModal = $("#modalSettings");

        $("body").attr("data-settings", idBtnDirection);
        const $menuDirection = localStorage.getItem("menu_direction");

        if (idBtnDirection === "window") {
            $linkSettings.addClass("none");
            $settingsBox.removeClass("hidden");
            $settingsModal.removeClass("modal_left");
        } else {
            $linkSettings.removeClass("none");
            $settingsBox.addClass("hidden");
            if ($menuDirection === "vertical") {
                $settingsModal.addClass("modal_left");
            }
        }

        $("#modalSettings #textPosiSettings").text(idBtnText);
        localStorage.setItem("btn_settings", idBtnDirection);
    }
    function handleSwitchClick($button) {
        const $activeSpan = $button.find("span.active");
        $activeSpan.removeClass("active");

        const $nextSpan = $activeSpan.next("span").length ? $activeSpan.next("span") : $button.find("span").first();
        $nextSpan.addClass("active");

        const switchId = $button.attr("id");
        const spanId = $nextSpan.attr("id");

        const updateFunctions = {
            themeSwitch: updateTheme,
            menuSwitch: updateMenu,
            btnSettingsSwitch: updateSettings,
        };

        if (updateFunctions[switchId]) {
            updateFunctions[switchId](spanId);
        }

        $button.addClass("change");
        setTimeout(() => $button.removeClass("change"), 2000);
    }

    $(".btn-switch").on("click", function () {
        handleSwitchClick($(this));
    });

    function initializeSwitch(switchId, storageKey, updateFunction) {
        const storageValue = localStorage.getItem(storageKey);
        if (storageValue) {
            const $switch = $(`#${switchId}`);
            $switch.find("span").removeClass("active");
            const $targetSpan = $switch.find(`span[id^='${storageValue}']`);
            $targetSpan.addClass("active");
            updateFunction($targetSpan.attr("id"));
        }
    }
    initializeSwitch("themeSwitch", "theme", updateTheme);
    initializeSwitch("menuSwitch", "menu_direction", updateMenu);
    initializeSwitch("btnSettingsSwitch", "btn_settings", updateSettings);

    // Change Color detail ######################################################################
    $("[data-toggle-color]").click(function () {
        const thisColor = $(this).attr("data-toggle-color");
        $("[data-toggle-color]").removeClass("active");
        $(this).addClass("active");
        $("body").attr("data-color", thisColor);
        localStorage.setItem("detail", thisColor);

        const btnDynamic = $("#btnDynamic");
        btnDynamic.removeClass("bg-dynamic");
        btnDynamic.addClass("rainbow");
    });
    const storageColor = localStorage.getItem("detail");
    if (storageColor) {
        $("body").attr("data-color", storageColor);
        $("[data-toggle-color]").removeClass("active");
        $(`[data-toggle-color="${storageColor}"]`).addClass("active");
    }

    // LocalStorage Data ################################################
    $("#deleteStorage").click(() => {
        $("#storageSize").text("0B");
        localStorage.clear();
    });
    $("#storageSize").text(function () {
        let totalPeso = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const clave = localStorage.key(i);
            const valor = localStorage.getItem(clave);
            totalPeso += new Blob([valor]).size;
        }
        return `${totalPeso}B`;
    });

    // Picture in Card #####################################################
    $(".card-picture").each(function () {
        const img = $(this).find("img.picture");
        const imgSrc = img.attr("src");

        if (imgSrc) {
            $(this).css("background-image", `url(${imgSrc})`);
        }
        img.remove();
    });

    // Forms #####################################################
    $("[data-nosubmit]").on("submit", (event) => {
        event.preventDefault();
    });

    // Copy To Clipboard #####################################################
    $(document).on("click", "[data-copy]", function () {
        const $item = $(this);
        const textCopy = $item.attr("data-copy");
        copyToClipboard(textCopy);
    });

    // Transfer click #####################################################
    $(document).on("click", "[data-click]", function () {
        const thisElement = $(this).data("click");
        $(thisElement).click();
    });

    // Cargar archivo #####################################################
    $("[data-change]").on("change", function () {
        const fileName = $(this).prop("files")[0]?.name || "";
        const targetSelector = $(this).data("change");

        if (targetSelector) {
            $(targetSelector).text(fileName).removeClass("opacity");

            if ($(targetSelector).is("input, textarea")) {
                $(targetSelector).val(fileName);
            }
        }
    });
});

// Copy To Clipboard Function #####################################################
function copyToClipboard(textToCopy, msgClipboard = false) {
    if (!navigator.clipboard) {
        toast("center", 8000, "info", "UPS!... Tu navegador no admite copiar al portapapeles 😯😥🤔");
        return;
    }
    if (textToCopy !== "") {
        navigator.clipboard
            .writeText(textToCopy)
            .then(function () {
                toast("top", 5000, "success", msgClipboard ? msgClipboard : "Texto copiado al portapapeles 📋👍");
            })
            .catch(function (error) {
                var message = "Error al copiar en el portapapeles";
                console.error(message + ":", error);
                toast("top", 8000, "error", message + " 🤔😥");
            });
    }
}

// Get Geolocation Function #####################################################
function getGeoLocation(successCallback, errorCallback, customMessages = {}) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const coords = {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                };
                successCallback(coords);
            },
            function (error) {
                const defaultMessages = {
                    PERMISSION_DENIED: "Por favor, permite el acceso a la ubicación en tu navegador.",
                    POSITION_UNAVAILABLE: "La ubicación no está disponible. Activa el GPS e intenta nuevamente.",
                    TIMEOUT: "La solicitud para obtener la ubicación tardó demasiado. Intenta nuevamente.",
                    UNKNOWN_ERROR: "Ocurrió un error desconocido al intentar obtener tu ubicación.",
                };

                const messages = { ...defaultMessages, ...customMessages };
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = messages.PERMISSION_DENIED;
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = messages.POSITION_UNAVAILABLE;
                        break;
                    case error.TIMEOUT:
                        errorMessage = messages.TIMEOUT;
                        break;
                    default:
                        errorMessage = messages.UNKNOWN_ERROR;
                        break;
                }

                if (typeof errorCallback === "function") {
                    errorCallback(errorMessage);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    } else {
        const message = "La geolocalización no es compatible con este navegador.";
        if (typeof errorCallback === "function") {
            errorCallback(message);
        }
    }
}

// Template Alertas With Switalert ######################################
function toast(posittionS, timerS, iconS, titleS, isToast = true, pBarrS = true, didDestroyS) {
    const Toast = Swal.mixin({
        toast: isToast,
        position: posittionS,
        showConfirmButton: false,
        showCloseButton: true,
        timer: timerS,
        timerProgressBar: pBarrS,
        customClass: {
            icon: "icon_alert",
            title: "title_alert",
            timerProgressBar: "progressbar_alert",
            closeButton: "close_button_alert",
        },
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
        didDestroy: didDestroyS,
    });
    Toast.fire({
        // Swal.fire({
        icon: iconS,
        title: titleS,
    });
}

// Replace Accents #####################################################
const replaceAccents = (text) => {
    const accentsMap = {
        "Ã¡": "á",
        "Ã©": "é",
        Ãí: "í",
        "Ã³": "ó",
        Ãº: "ú",
        "Ã±": "ñ",
        "Ã‘": "Ñ",
        "Ã¡": "á",
        "Ã©": "é",
        "Ã­": "í",
        "Ã³": "ó",
        Ãº: "ú",
        "Ã‘": "Ñ",
        "Ã±": "ñ",
        "Ã»": "ü",
        "Ã¯": "ï",
    };

    return text.replace(/Ã¡|Ã©|Ã­|Ã³|Ãº|Ã±|Ã‘|Ã»|Ã¯/g, (match) => accentsMap[match] || match);
};

// Global Today #####################################################
const todayNow = new Date();

function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    const hours24 = String(hours).padStart(2, "0");
    const minutes24 = String(minutes).padStart(2, "0");
    return `${hours24}:${minutes24}`;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

// Country Flags list ###############################################################################
const countryFlags = {
    // América del Norte
    Mexico: "🇲🇽",
    México: "🇲🇽",
    "United States of America": "🇺🇸",
    "United States": "🇺🇸",
    "Estados Unidos": "🇺🇸",
    Canada: "🇨🇦",
    Canadá: "🇨🇦",
    // América del Sur
    Argentina: "🇦🇷",
    Brazil: "🇧🇷",
    Brasil: "🇧🇷",
    Chile: "🇨🇱",
    Colombia: "🇨🇴",
    Peru: "🇵🇪",
    Perú: "🇵🇪",
    Venezuela: "🇻🇪",
    Uruguay: "🇺🇾",
    Paraguay: "🇵🇾",
    Ecuador: "🇪🇨",
    // Europa
    Spain: "🇪🇸",
    España: "🇪🇸",
    France: "🇫🇷",
    Francia: "🇫🇷",
    Germany: "🇩🇪",
    Alemania: "🇩🇪",
    Italy: "🇮🇹",
    Italia: "🇮🇹",
    "United Kingdom": "🇬🇧",
    "Reino Unido": "🇬🇧",
    Portugal: "🇵🇹",
    Netherlands: "🇳🇱",
    "Países Bajos": "🇳🇱",
    Belgium: "🇧🇪",
    Bélgica: "🇧🇪",
    Switzerland: "🇨🇭",
    Suiza: "🇨🇭",
    Sweden: "🇸🇪",
    Suecia: "🇸🇪",
    Norway: "🇳🇴",
    Noruega: "🇳🇴",
    Denmark: "🇩🇰",
    Dinamarca: "🇩🇰",
    Russia: "🇷🇺",
    Rusia: "🇷🇺",
    // Asia
    Japan: "🇯🇵",
    Japón: "🇯🇵",
    China: "🇨🇳",
    "South Korea": "🇰🇷",
    SouthKorea: "🇰🇷",
    "Corea del Sur": "🇰🇷",
    India: "🇮🇳",
    Thailand: "🇹🇭",
    Tailandia: "🇹🇭",
    Philippines: "🇵🇭",
    Filipinas: "🇵🇭",
    Indonesia: "🇮🇩",
    SaudiArabia: "🇸🇦",
    "Saudi Arabia": "🇸🇦",
    "Arabia Saudita": "🇸🇦",
    // África
    Egypt: "🇪🇬",
    Egipto: "🇪🇬",
    "South Africa": "🇿🇦",
    SouthAfrica: "🇿🇦",
    Sudáfrica: "🇿🇦",
    Morocco: "🇲🇦",
    Marruecos: "🇲🇦",
    Nigeria: "🇳🇬",
    Kenya: "🇰🇪",
    Kenia: "🇰🇪",
    // Oceanía
    Australia: "🇦🇺",
    NewZealand: "🇳🇿",
    "New Zealand": "🇳🇿",
    "Nueva Zelanda": "🇳🇿",
};

// Change theme shortcut ######################################################################
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        $("#themeSwitch").click();
    }
});

// context menu disabled ######################################################################
// document.oncontextmenu = () => false;
// document.addEventListener("keydown", (event) => {
//     const forbiddenKeys = [
//         { ctrl: true, shift: true, key: "C" },
//         { ctrl: true, shift: true, key: "E" },
//         { ctrl: true, shift: true, key: "I" },
//         { ctrl: true, shift: true, key: "J" },
//         { ctrl: true, shift: true, key: "K" },
//         { ctrl: true, shift: true, key: "M" },
//         { ctrl: false, shift: false, key: "F12" },
//     ];

//     if (forbiddenKeys.some((k) => event.ctrlKey === k.ctrl && event.shiftKey === k.shift && event.key === k.key)) {
//         event.preventDefault();
//     }
// });

var expressions = {
    name: /^[a-zA-ZÀ-ÿ\s]+$/,
    username: /^(?![0-9_-])[a-zA-Z0-9_-]+$/,
    email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?&])[A-Za-z\d@#<>:;$!%*.?&]{8,}$/,
    title: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9\s\-_#]*$/,
    number: /^[0-9]+$/,
};

console.log(navigator.userAgent);
console.log(navigator.language);
console.log(navigator.platform);
console.log(screen.width, screen.height);
fetch("https://api.ipify.org?format=json")
  .then(res => res.json())
  .then(data => console.log("Tu IP pública es:", data.ip));

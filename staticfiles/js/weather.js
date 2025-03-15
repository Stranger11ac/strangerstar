const locationInput = $("#location");
const locationSugg = $("#locationsugg");
const storageLocationData = JSON.parse(localStorage.getItem("weather_data"));
const BASE_URL = "https://api.weatherapi.com/v1/search.json";
const APIKEY_URL = "1d113d7dd4f3464c82462425251501";

locationInput.on("keypress", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});

$("#btnLocation").on("click", () => {
    if (!locationInput.val()) {
        return toast("center", 9000, "error", "Por favor ingresar una Ciudad <span class='ic-solar map-point-search'></span> o busca por tu Ubicación <span class='ic-solar gps-bold-duotone'></span>.");
    }
    searchWeather();
});
$("#searchCoords").on("click", () => {
    getGeoLocation(
        (coords) => searchWeather(false, [coords.longitude, coords.latitude]),
        (errorMessage) => toast("center", 8000, "error", errorMessage)
    );
});

if (storageLocationData) {
    updateWeatherUI(storageLocationData);
    activeWeatherUI();
    console.log(storageLocationData);
}

function searchWeather(storageCityCountry = false, coords = false) {
    let cityCountry = locationInput.val()?.trim() || storageCityCountry;
    let queryParam = coords ? `${coords[1]},${coords[0]}` : cityCountry;

    if (!coords && cityCountry.includes(",")) {
        queryParam = cityCountry
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
            .join(",");
    }

    const fetchAPI = `${BASE_URL}/forecast.json?key=${APIKEY_URL}&q=${queryParam}&days=8&lang=es`;
    fetch(fetchAPI)
        .then((response) => {
            if (!response.ok) throw new Error(`Error al obtener datos: ${response.statusText}`);
            return response.json();
        })
        .then((json) => {
            if (!json || !json.forecast) {
                toast("top", 8000, "error", "No se encontró información para esta ubicación.");
                return;
            }
            updateWeatherUI(json);
            locationInput.blur();
            activeWeatherUI();

            localStorage.setItem("weather_data", JSON.stringify(json));
        })
        .catch((error) => {
            if (error.message.includes("403")) {
                toast("center", 8000, "error", "Límite de consultas alcanzado.");
            } else {
                toast("center", 8000, "error", "Hubo un error al consultar el clima.");
            }
            $("#weatherInfo").removeClass("active");
            console.error("Error al consultar la API:", error);
        });
}

function iconToCondition(condition, sunUp) {
    const conditionIcons = {
        despejado: "sun",
        soleado: "sun",
        claro: "sun",
        moderada: "cloud-rain-line-duotone",
        lluvia: "cloud-rain-bold-duotone",
        lluvias: "cloud-rain-bold-duotone",
        llovizna: "cloud-rain-line-duotone",
        precipitaciones: "cloud-rain-line-duotone",
        nieve: "cloud-snowfall-bold-duotone",
        parcialmente: "cloud",
        nublado: "clouds-bold-duotone",
        cubierto: "clouds-bold-duotone",
        tormenta: "cloud-storm-bold-duotone",
        tormentosos: "cloud-storm-bold-duotone",
        trueno: "cloud-storm-bold-duotone",
        viento: "wind-broken",
        ventoso: "wind-broken",
        neblina: "fog-bold-duotone",
        niebla: "fog-bold-duotone",
        frío: "snowflake-bold-duotone",
        helado: "snowflake-bold-duotone",
        relámpago: "cloud-bolt-bold-duotone",
        caluroso: "sun-big",
    };
    for (let [key, icon] of Object.entries(conditionIcons)) {
        if (condition.includes(key)) {
            if (icon === "sun") {
                return sunUp ? icon : "moon-stars_hover-glint";
            } else if (icon === "cloud") {
                return sunUp ? "ic-solar cloud-sun-bold-duotone" : "cloudy-moon-bold-duotone";
            }
            return icon;
        }
    }
    return "star";
}

function calculateDegCircle(startTime, endTime) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const currentMinutes = todayNow.getHours() * 60 + todayNow.getMinutes();
    const totalMinutesInDay = 24 * 60;

    const adjustedEnd = endMinutes < startMinutes ? endMinutes + totalMinutesInDay : endMinutes;
    const adjustedCurrent = currentMinutes < startMinutes ? currentMinutes + totalMinutesInDay : currentMinutes;
    const dayDuration = adjustedEnd - startMinutes;
    const minutesSinceStart = adjustedCurrent - startMinutes;
    const fraction = Math.min(Math.max(minutesSinceStart / dayDuration, 0), 1);

    return 360 + fraction * 90;
}

function createForecastItem({ date, temp_c, condition, isNow, isDay }) {
    const classNow = isNow ? "detail radius-inset now" : "";
    const icon = iconToCondition(condition.toLowerCase(), isDay);
    return `
        <div class="flexbox flex-column between p-5 center ${classNow}" title="${condition}">
            <strong>${Math.floor(temp_c)}°</strong>
            <span class="ic-solar ${icon} size" style="--size: 50px;"></span>
            <strong>${date.split(" ")[1]}</strong>
        </div>`;
}

function scrollToNow() {
    const container = document.querySelector(".inset-item");
    const nowElement = container.querySelector(".now");

    if (container && nowElement) {
        nowElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }
}

function activeWeatherUI() {
    $("#weatherInfo").removeClass("active");
    setTimeout(() => $("#weatherInfo").addClass("active"), 1000);
}

function updateWeatherUI(json) {
    const { location, current, forecast } = json;
    const { localtime, tz_id, name, region, country } = location;
    const { condition, temp_c, wind_kph, wind_degree, humidity, pressure_mb, uv, dewpoint_c, vis_km, cloud } = current;
    const forecastday = forecast.forecastday;
    const sunrise = convertTo24Hour(forecastday[0].astro.sunrise);
    const sunset = convertTo24Hour(forecastday[0].astro.sunset);
    const [sunriseHour, sunsetHour] = [convertTo24Hour(sunrise), convertTo24Hour(sunset)].map((time) => time.split(":")[0]);

    const wToday = new Date(localtime);
    const getHourNow = wToday.getHours();
    const isSunUp = sunriseHour <= getHourNow && sunsetHour >= getHourNow;

    const wIcon = $("#mainIcon");
    const newIcon = iconToCondition(condition.text.toLowerCase(), isSunUp);
    wIcon.removeClass().addClass(`ic-solar ${newIcon} size`);
    const countryFlag = countryFlags[country];

    $("#cityLocation").html(`${replaceAccents(name)}, ${replaceAccents(region.split(",")[0])} <span class="ml-5">${countryFlag}</span>`);
    $("#temperature").text(`${Math.floor(temp_c)}°C`);
    $("#description").text(condition.text.toLowerCase());

    const dayList = $("#dayList");
    const wDateOptions = { timeZone: tz_id, weekday: "short", day: "2-digit" };
    const wTomorrowDay = new Date(forecastday[1].date).getDate() + 1;
    dayList.empty();
    forecastday.forEach((day, index) => {
        const [wYear, wMonth, wDayNumber] = day.date.split("-").map(Number);
        const wDate = new Date(Date.UTC(wYear, wMonth - 1, wDayNumber + 1));
        let wFormattedDate = wDate.toLocaleDateString("es-MX", wDateOptions);
        let dayCondition = day.day.condition.text,
            wDayLink = `href="?dt=${day.date}"`,
            wItemListBg = "bg-second",
            dayNone;

        if (wDayNumber === wToday.getDate()) {
            wFormattedDate = "hoy";
            wItemListBg = "detail";
            dayNone = "none";
        } else if (wDayNumber === wTomorrowDay) {
            wFormattedDate = "mañana";
        }

        const listItem = `
            <div id="${index}" class="flexbox between flex-wrap gap_5 radius ${wItemListBg} p-10">
                <span class="capitalize">${wFormattedDate}</span>
                <span class="ic-solar ${iconToCondition(dayCondition.toLowerCase(), true)}"></span>
                <span>${Math.floor(day.day.maxtemp_c)}° / ${Math.floor(day.day.mintemp_c)}°</span>
                <span class="w100 end fs-08 ${dayNone}">${dayCondition}</span>
            </div>`;

        dayList.append(listItem);
    });

    const hoursList = $("#hoursList");
    hoursList.empty();
    const hoursFragment = document.createDocumentFragment();
    forecastday[0].hour.forEach((hour) => {
        const hourItemHTML = createForecastItem({
            date: hour.time,
            temp_c: hour.temp_c,
            condition: hour.condition.text,
            isNow: todayNow.getHours().toString().padStart(2, "0") === hour.time.split(" ")[1].split(":")[0],
            isDay: hour.is_day,
        });
        hoursFragment.appendChild($(hourItemHTML)[0]);
    });
    hoursList.append(hoursFragment);

    $("#compass").css("--deg", `${wind_degree}deg`);
    $("#compass .compass-info").html(`Viento:</br>${wind_kph}&nbsp;km&nbsp;/&nbsp;h`);

    $("#sunOrbit").css("--deg", `${calculateDegCircle(sunrise, sunset)}deg`);
    $("#sunrise").text(sunrise);
    $("#sunset").text(sunset);

    $("#humidity").text(`${humidity}%`);
    $("#pressure").text(pressure_mb);
    $("#uv").text(uv);
    $("#dewpoint").text(`${dewpoint_c}°`);
    $("#visinility").text(vis_km);

    const { daily_chance_of_rain: chanceRain, daily_chance_of_snow: chanceSnow } = forecast.forecastday[0].day;
    if (chanceRain > 0) {
        $("#chanceRain").text(`${chanceRain}%`);
        if (chanceSnow === 0) $("#weatherInfo").addClass("has-clouds");
    } else {
        $("#weatherInfo").removeClass("has-clouds");
        $("#chanceRainParent").remove();
    }

    if (chanceSnow > 0) {
        $("#chanceSnow").text(`${chanceSnow}%`);
        if (chanceRain === 0) $("#weatherInfo").addClass("has-clouds");
    } else {
        $("#weatherInfo").removeClass("has-clouds");
        $("#chanceSnowParent").remove();
    }

    if (cloud > 0) {
        $("#clouds").text(`${cloud}%`);
        $("#weatherInfo").addClass("has-clouds");
    } else {
        $("#cloudsParent").remove();
        $("#weatherInfo").removeClass("has-clouds");
    }

    setDateOnTitleHead(wToday);

    const parentHList = hoursList.parent();
    const hListDelay = parseFloat(getComputedStyle(parentHList[0]).getPropertyValue("--i")) || 0;
    setTimeout(() => scrollToNow(), hListDelay * 2000);
}

function setDateOnTitleHead(setToday) {
    const dateOptions = { weekday: "short", day: "2-digit", month: "long" };
    const currentDateTitle = new Date(setToday).toLocaleDateString("es-MX", dateOptions);
    document.head.querySelector("title").innerText = `Clima | ${currentDateTitle} | Stranger Star`;
}

locationInput.on("input", () => {
    const query = locationInput.val();
    if (query.length < 3) return;

    fetch(`${BASE_URL}/search.json?key=${APIKEY_URL}&q=${query}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error en la API");
            return response.json();
        })
        .then((data) => {
            locationSugg.empty();
            const uniqueLocations = new Set(); // Crear un conjunto para evitar duplicados

            data.forEach((lugar) => {
                const locationText = `${replaceAccents(lugar.name)}, ${replaceAccents(lugar.region)}, ${replaceAccents(lugar.country)}`;
                if (!uniqueLocations.has(locationText)) {
                    uniqueLocations.add(locationText);
                    locationSugg.append($("<option>").val(locationText));
                }
            });
        })
        .catch((error) => console.error("Error:", error));
});

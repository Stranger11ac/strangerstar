$(document).ready(function () {
    // Token de acceso a Mapbox
    mapboxgl.accessToken = "pk.eyJ1Ijoic3RyYW5nZXIxMS1tYiIsImEiOiJjbTZtem4xZTgwcWpwMmpvdDN4aWp1Z2d1In0.9ePWDi-AsO6GXhcz-WqV_Q";

    // Crear el mapa
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-100.93991699257235, 25.5523656707213],
        zoom: 15,
    });

    let blueMarker, redMarker;

    // Marcadores adicionales
    const markers = [
        new mapboxgl.Marker({
            draggable: true,
            element: createCustomMarker("orange", "2"),
        })
            .setLngLat([-100.94003091219066, 25.55250705152784])
            .addTo(map),
        new mapboxgl.Marker({
            draggable: true,
            element: createCustomMarker("green", "3"),
        })
            .setLngLat([-100.93964199011961, 25.552319543144392])
            .addTo(map),
    ];

    // Función para crear el marcador con CSS personalizado
    function createCustomMarker(setColor = "gdwhite", setId = null, setIcon = "map-point") {
        const markerElement = document.createElement("div");
        markerElement.style.width = "50px";
        markerElement.style.height = "80px";
        markerElement.setAttribute("data-id", setId);

        const iconElement = document.createElement("span");
        iconElement.className = `mapbox_marker ic-solar ${setIcon} ${setColor}`;
        iconElement.style.width = "50px";
        iconElement.style.height = "50px";

        markerElement.appendChild(iconElement);
        return markerElement;
    }

    // Evento para crear marcador azul al hacer clic derecho
    $(map.getCanvasContainer()).on("contextmenu", function (e) {
        e.preventDefault();
        const rect = map.getCanvasContainer().getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        const lngLat = map.unproject([point.x, point.y]);
        const coordinates = [lngLat.lng, lngLat.lat];

        if (blueMarker) {
            blueMarker.remove();
        }

        // Crear un nuevo marcador azul
        blueMarker = new mapboxgl.Marker({ element: createCustomMarker("blue", "1", "map-point") }).setLngLat(coordinates).addTo(map);
        copyToClipboard(coordinates.join(", "), "Coordenadas del marcador copiadas al portapapeles.");
    });

    // Agregar los controles de dibujo
    const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
        },
    });

    // Crear marcador rojo y verificar su posición
    // getGeoLocation(
    //     (coords) => {
    //         const userCoordinates = [coords.longitude, coords.latitude];
    //         let bodyUserName = "0";
    //         if ($("body").data("usnm")) {
    //             bodyUserName = $("body").data("usnm").toLowerCase();
    //         }
    //         redMarker = new mapboxgl.Marker({ element: createCustomMarker("bg-detail", bodyUserName, "map-point-wave") }).setLngLat(userCoordinates).addTo(map);

    //         map.setCenter(userCoordinates);
    //     },
    //     (errorMessage) => toast("center", 8000, "error", errorMessage)
    // );

    // Evaluar marcadores dentro del polígono
    function countMarkersInsidePolygon(polygon) {
        /*
         * En esta lista se incluen los marcadores a filtrar
         * por ahora solo se filtran redMarker, blueMarker y los otros en el grupo
         * ⚠️ los demas marcadores no se toman en cuenta aunque esten dentro del poligono
         */
        const allMarkers = [redMarker, blueMarker, ...markers].filter(Boolean);
        const points = allMarkers.map((marker) => turf.point(marker.getLngLat().toArray()));

        // Filtrar solo los puntos dentro del polígono
        const insideMarkers = points.filter((point) => turf.booleanPointInPolygon(point, polygon));
        const insideCount = insideMarkers.length;
        const insideMarkerData = insideMarkers.map((point, index) => {
            const marker = allMarkers[index];
            return {
                id: marker.getElement().getAttribute("data-id"),
                coordinates: marker.getLngLat().toArray(),
            };
        });

        toast("bottom", 10000, "info", `Hay ${insideCount} marcador(es) dentro del polígono.`);

        /*
         * Esto se asigna a una vaiable gloval
         * despues es enviada mediante fetch
         * se envia una lista de las id
         * las id seran las iniciales o un distintivo de los alumnos
         */
        // console.table(insideMarkerData);
    }

    // Evento de dibujo (crear, actualizar o eliminar)
    map.on("draw.create", updateArea);
    map.on("draw.update", updateArea);
    map.on("draw.delete", updateArea);

    function updateArea() {
        const data = draw.getAll();
        if (data.features.length > 0) {
            const polygon = data.features[0];
            countMarkersInsidePolygon(polygon);
        }
    }

    // const colors = ["#FF0000", "#0000FF", "#008000", "#FFA500", "#800080"]; // Rojo, Azul, Verde, Naranja, Morado
    // let waypoints = [];

    // map.on("click", (e) => {
    //     if (waypoints.length >= colors.length) {
    //         alert("Máximo de puntos alcanzado");
    //         return;
    //     }

    //     const newPoint = {
    //         coordinates: [e.lngLat.lng, e.lngLat.lat],
    //         color: colors[waypoints.length],
    //     };
    //     waypoints.push(newPoint);

    //     // Añadir marcador al mapa
    //     new mapboxgl.Marker({ color: newPoint.color }).setLngLat(newPoint.coordinates).addTo(map);

    //     // Si hay al menos dos puntos, trazar la ruta
    //     if (waypoints.length > 1) {
    //         updateRoute();
    //     }
    // });

    // function updateRoute() {
    //     const coordinates = waypoints.map((wp) => wp.coordinates).join(";");

    //     fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             const route = data.routes[0].geometry;

    //             // Eliminar capa previa si existe
    //             if (map.getSource("route")) {
    //                 map.getSource("route").setData({ type: "Feature", geometry: route });
    //             } else {
    //                 map.addLayer({
    //                     id: "route",
    //                     type: "line",
    //                     source: {
    //                         type: "geojson",
    //                         data: { type: "Feature", geometry: route },
    //                     },
    //                     layout: { "line-join": "round", "line-cap": "round" },
    //                     paint: { "line-color": "#000", "line-width": 4 },
    //                 });
    //             }
    //         })
    //         .catch((error) => console.error("Error al obtener la ruta:", error));
    // }

    const routing = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/walking",
        controls: {
            // inputs: false,
            // instructions: false,
            profileSwitcher: false,
        },
        alternatives: true,
        placeholderOrigin: "Inicio:",
        placeholderDestination: "Destino:",
        language: "es",
        // waypointName: ["I", "D"], // No funciona
        // interactive: false,
        // steps: false, // No funciona
        // annotation: ["distance", "duration", "speed"], // No funciona
    });

    const mapControls = [{ control: new mapboxgl.NavigationControl() }, { control: draw }, { control: routing, position: "top-left" }];
    mapControls.forEach(({ control, position }) => map.addControl(control, position));
});

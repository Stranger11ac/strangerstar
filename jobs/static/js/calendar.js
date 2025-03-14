document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("todayCalendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            start: "title",
            end: "today,prev,next",
        },
        footerToolbar: {
            end: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
        },
        initialView: "dayGridMonth",
        nowIndicator: true,
        height: "auto",
        locale: "es",
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            omitZeroMinute: true,
            hour12: false,
        },
        events: [
            { title: "Día de la Constitución", start: "2025-02-05", description: "Aniversario de la promulgación de la Constitución de 1917.", color: "#ff5733" },
            { title: "Día de la Bandera", start: "2025-02-24", description: "Celebración del símbolo patrio de México.", color: "#33ff57" },
            { title: "Natalicio de Benito Juárez", start: "2025-03-21", description: "Conmemoración del nacimiento de Benito Juárez.", color: "#3357ff" },
            { title: "Semana Santa", start: "2025-04-13", end: "2025-04-20", description: "Celebraciones religiosas en todo México.", color: "#ff33a1" },
            { title: "Día del Trabajo", start: "2025-05-01", description: "Conmemoración de los derechos laborales.", color: "#ffaa33" },
            { title: "Día de la Batalla de Puebla", start: "2025-05-05", description: "Victoria del ejército mexicano sobre Francia en 1862.", color: "#a133ff" },
            { title: "Día de la Marina", start: "2025-06-01", description: "Homenaje a la Armada de México.", color: "#33a1ff" },
            { title: "Día del Padre", start: "2025-06-15", description: "Celebración del Día del Padre en México.", color: "#ff5733" },
            { title: "Día de la Independencia", start: "2025-09-16", description: "Fiesta nacional por la independencia de México.", color: "#57ff33" },
            { title: "Día de Muertos", start: "2025-11-01", end: "2025-11-02", description: "Celebración tradicional para honrar a los difuntos.", color: "#ff33aa" },
            { title: "Día de la Revolución", start: "2025-11-20", description: "Conmemoración del inicio de la Revolución Mexicana en 1910.", color: "#33ffcc" },
            { title: "Día de la Virgen de Guadalupe", start: "2025-12-12", description: "Celebración religiosa en honor a la Virgen de Guadalupe.", color: "#ffaa33" },
            { title: "Navidad", start: "2025-12-25", color: "#ff3333" },
        ],
        eventClick: function (info) {
            const startDate = info.event.start ? info.event.startStr : "";
            const endDate = info.event.end ? info.event.endStr : "";
            const description = info.event.extendedProps.description ? `<br><br> ${info.event.extendedProps.description}` : "";

            Swal.fire({
                title: info.event.title,
                html: `<span class="opacity">${startDate}${endDate ? " - " + endDate : ""}</span> ${description}`,
                showCloseButton: true,
                showConfirmButton: false,
            });
        },
        dateClick: function (info) {
            $("#eventStart").val(info.dateStr).attr("min", info.dateStr);
            $("#eventEnd").attr("min", info.dateStr);
            $("#modalAddEvent").addClass("visible");
        },
    });
    calendar.render();

    $("#addEvnetForm").on("submit", function (event) {
        event.preventDefault();

        const dateTitle = $(this).find("#eventTitle").val();
        const dateStartVal = $(this).find("#eventStart").val();
        const dateStart = new Date(dateStartVal);
        const dateEndVal = $(this).find("#eventEnd").val();
        const dateEnd = new Date(dateEndVal);
        const dateDesc = $(this).find("#EventDesc").val();

        if (!isNaN(dateStart.valueOf())) {
            calendar.addEvent({
                title: dateTitle,
                start: dateStart,
                end: dateEnd,
                description: dateDesc,
                classNames: "detail",
                borderColor: false,
            });
        }
        $(".overlay").removeClass("none");
        $("#modalAddEvent").removeClass("visible");
        $(this).trigger("reset");
    });
});

// Configurations ###############################################################################
// document.addEventListener("DOMContentLoaded", function () {
//     function formatDate(date) {
//         const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
//         return date.toLocaleDateString("es-ES", options);
//     }
//     function formatTime(date) {
//         const options = { hour: "2-digit", minute: "2-digit", hour12: true };
//         return date.toLocaleTimeString("es-ES", options);
//     }
//     function formatDateInput(date) {
//         return date.toISOString().slice(0, 10);
//     }
//     function formatTimeInput(date) {
//         return date.toTimeString().slice(0, 5);
//     }
//     var calendarEl = document.getElementById("todayCalendar");
//     var dataEvents = calendarEl.getAttribute("data-events");
//     var calendar = new FullCalendar.Calendar(calendarEl, {
//         headerToolbar: {
//             start: "title",
//             end: "today,prev,next",
//         },
//         footerToolbar: {
//             start: "timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear",
//             end: "prevYear,nextYear",
//         },
//         firstDay: 0, // Domingo
//         events: dataEvents,
//         initialView: "dayGridMonth",
//         locale: "es",
//         height: "auto",
//         navLinks: true,
//         nowIndicator: true,
//         weekNumbers: true,
//         weekText: "",
//         slotLabelFormat: {
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//         },
//         eventTimeFormat: {
//             hour: "numeric",
//             hour12: true,
//             meridiem: "narrow",
//         },
//         views: {
//             timeGridWeek: {
//                 hiddenDays: [0, 6],
//             },
//             dayGridMonth: {
//                 displayEventTime: false,
//             },
//             multiMonthYear: {
//                 multiMonthMaxColumns: 4,
//                 multiMonthMinWidth: 250,
//             },
//         },
//         eventClick: function (info) {
//             var eventObj = info.event;
//             const imgJson = eventObj.extendedProps.imagen;
//             var myModal = new mdb.Modal(document.getElementById("eventModal"));
//             const valEnd = eventObj.end;
//             const valStart = eventObj.start;
//             const valTitulo = eventObj.title;
//             const valallDay = eventObj.allDay;
//             const valclassNames = eventObj.classNames;
//             const valBtn = eventObj.extendedProps.button;
//             const valPleace = eventObj.extendedProps.location;
//             const valDescription = eventObj.extendedProps.description;

//             if ($("#eventModal").hasClass("calendar_update")) {
//                 $(".idUpdate").val(eventObj.id);

//                 $("#tituloUpdate").addClass("active").val(valTitulo);
//                 $(".eventTitle").text(valTitulo);

//                 $("#informacionUpdate").addClass("active").val(valDescription);
//                 $("#redirigirUpdate").addClass("active").val(valBtn);
//                 $("#ePleaceUpdate").addClass("active").val(valPleace);
//                 $("#eStartUpdate")
//                     .addClass("active")
//                     .val(`${formatDateInput(valStart)}T${formatTimeInput(valStart)}`);
//                 if (valEnd) {
//                     $("#eEndUpdate")
//                         .addClass("active")
//                         .val(`${formatDateInput(valEnd)}T${formatTimeInput(valEnd)}`);
//                 } else {
//                     $("#eEndUpdate")
//                         .addClass("active")
//                         .val(`${formatDateInput(valStart)}T${formatTimeInput(valStart)}`);
//                 }
//                 if (valallDay) {
//                     $("#eAllDayUpdate").attr("checked", true);
//                 } else {
//                     $("#eAllDayUpdate").attr("checked", false);
//                 }
//                 $("#eColorUpdate option#eColorSelected").attr("selected", false);
//                 $(`#eColorUpdate option[value="${valclassNames}"]`).attr("selected", true);
//                 $("[data-select_addClass]").attr("class", `form-select change_bg ${valclassNames}`);

//                 if (imgJson == "") {
//                     $("[for='imagenUpdate']").html('Subir Imagen <i class="fa-regular fa-images ms-1"></i>');
//                 } else {
//                     $("[for='imagenUpdate']").html('Cambiar Imagen <i class="fa-regular fa-images ms-1"></i>');
//                 }
//             } else {
//                 $("#eventModalLabel").text(valTitulo);
//                 $("#eventStartDate").text(formatDate(valStart));
//                 $("#eventStartTime").text(formatTime(valStart));
//                 $("#eventLoc").text(valPleace || "Campus UTC");
//                 if (valDescription) {
//                     $("#eventDesc").text(valDescription);
//                 } else {
//                     $("#eventDesc").addClass("none");
//                 }
//                 if (valEnd) {
//                     $("#eventEndDate").text(formatDate(valEnd));
//                     $("#eventEndTime").text(formatTime(valEnd));
//                     $("#dateSeparator").removeClass("none");
//                 } else {
//                     $("#eventEndDate").text("");
//                     $("#eventEndTime").text("");
//                     $("#dateSeparator").addClass("none");
//                 }
//                 if (valBtn == "") {
//                     $("#eventBtnDiv").addClass("none");
//                     $("#eventBtn").attr("href", "");
//                 } else {
//                     $("#eventBtnDiv").removeClass("none");
//                     $("#eventBtn").attr("href", valBtn);
//                 }
//             }

//             if (imgJson == "") {
//                 $("#eventImg").addClass("none");

//                 if ($("#eventModal").hasClass("calendar_update")) {
//                     $("#eventImg").removeClass("none");
//                 }
//             } else {
//                 $("#eventImg").removeClass("none");
//                 let imgSrc = imgJson.replace("cross_asistent/", "");
//                 $("#eventImg").attr("src", imgSrc);
//             }

//             setTimeout(() => {
//                 myModal.show();
//             }, 300);

//             info.jsEvent.preventDefault();
//         },
//     });
//     calendar.render();

//     $(document).on("click", ".fc-multimonth-month", function () {
//         var dataDate = $(this).attr("data-date");
//         calendar.changeView("dayGridMonth", dataDate);
//     });
// });

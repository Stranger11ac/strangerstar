$(document).ready(function () {
    $("#usersTable").DataTable({
        // "language": {
        //     "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json"
        // },
        lengthChange: false,
        pageLength: 10, // Cantidad de registros por página
        order: [[0, "asc"]], // Ordenar por ID de forma descendente
        responsive: true, // Adaptar a pantallas pequeñas
        autoWidth: false, // Evitar que DataTables altere los anchos de columna
        language: {
            decimal: ",",
            thousands: ".",
            search: "Buscar:",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            infoEmpty: "",
            infoFiltered: "(_MAX_ registros totales)",
            zeroRecords: "No se encontraron coincidencias",
            paginate: {
                first: "<span class='ic-solar double-alt-arrow-left'></span>",
                previous: "<span class='ic-solar alt-arrow-left'></span>",
                next: "<span class='ic-solar alt-arrow-right'></span>",
                last: "<span class='ic-solar double-alt-arrow-right'></span>",
            },
        },
    });
});

$(document).ready(function () {
    $("#usersTable").DataTable({
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
                previous: "<span class='ic-solar alt-arrow-left-line'></span>",
                next: "<span class='ic-solar alt-arrow-right-line'></span>",
                last: "<span class='ic-solar double-alt-arrow-right'></span>",
            },
        },
    });

    
    $("#dt-search-0").attr("placeholder", "Buscar:");
});

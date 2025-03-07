$(document).ready(function () {
    $("#usersTable").DataTable({
        lengthChange: false,
        pageLength: 10, // Cantidad de registros por página
        order: [[0, "asc"]], // Ordenar por ID de forma descendente
        columnDefs: [
            { orderable: false, targets: 4 }, // Desactiva ordenación en la columna 4
            { searchable: false, targets: [0, 4] }, // Desactiva búsqueda en las columnas
        ],
        responsive: true, // Adaptar a pantallas pequeñas
        autoWidth: false, // Evitar que DataTables altere los anchos de columna
        language: {
            decimal: ",",
            thousands: ".",
            search: "",
            info: "_START_ - _END_ de _TOTAL_",
            infoEmpty: "",
            infoFiltered: "(_MAX_ en totales)",
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

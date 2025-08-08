$(document).ready(function () {
    let table = $("#usersTable").DataTable({
        lengthChange: false,
        // pageLength: 8, // Cantidad de registros por página
        order: [[0, "asc"]], // Ordenar por ID de forma ascendente
        columnDefs: [
            { orderable: false, targets: 6 }, // Desactiva ordenación en la columna 6
            { searchable: false, targets: [0, 6] }, // Desactiva búsqueda en las columnas
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

    // // Agregar filtros a la cabecera
    // $("#usersTable thead tr").clone(true).appendTo("#usersTable thead");

    // $("#usersTable thead tr:eq(1) th").each(function (i) {
    //     if (i === 4 || i === 5) {
    //         // Filtrar solo en las columnas "Distintivo" y "Número"
    //         $(this).html('<form><input type="text" placeholder="Filtrar:" /></form>');

    //         $("input", this).on("keyup change", function () {
    //             if (table.column(i).search() !== this.value) {
    //                 table.column(i).search(this.value).draw();
    //             }
    //         });
    //     } else {
    //         $(this).html(""); // Vacía los demás encabezados para evitar que se dupliquen
    //     }
    // });

    // // Botón para limpiar filtros
    // $("#clearFilters").on("click", function () {
    //     $("#usersTable thead tr:eq(1) input").val(""); // Vacía los campos
    //     table.columns().search("").draw(); // Restablece los filtros
    // });
});

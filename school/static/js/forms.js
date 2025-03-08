$(document).ready(function () {
    $("[data-validuser] #rol").on("change", function () {
        const valueRol = $(this).val();

        const $userDistintive = $("[data-validuser] #user_distintive");
        const $numListGroup = $("[data-validuser] #user_distintive #num_list_group");
        const $insignia = $("[data-validuser] #insignia");
        const $numList = $("[data-validuser] #num_list");

        toggleStudentInputs(valueRol, $userDistintive, $numListGroup, $insignia, $numList);
    });
    $("[data-validupuser] #up_rol").on("change", function () {
        const valueRol = $(this).val();

        const $distintive = $("[data-validupuser] #user_distintive");
        const $numListGroup = $("[data-validupuser] #user_distintive #num_list_group");
        const $insignia = $("[data-validupuser] #up_insignia");
        const $numList = $("[data-validupuser] #up_num_list");

        toggleStudentInputs(valueRol, $distintive, $numListGroup, $insignia, $numList);
    });

    function toggleStudentInputs(valueRol, distintive, numListGroup, insignia, numList) {
        if (valueRol === "admin") {
            distintive.slideUp();
            insignia.attr("data-required", "false");
            numList.attr("data-required", "false");
        } else {
            distintive.slideDown();
            if (valueRol === "student") {
                numListGroup.slideDown("fast");
                insignia.attr({
                    placeholder: "Grupo:",
                    "data-indications": "Escribe al menos 2 letras: 1A, 1B, 2A, 3Ctm, 3Ctv",
                    "data-required": "true",
                });
                numList.attr("data-required", "true");
            } else {
                numListGroup.slideUp("fast");
                insignia.attr({
                    placeholder: "Título Profesional:",
                    "data-indications": "Escribe la contracción del título: Ing., Lic., Mtro., Dr...",
                    "data-required": "true",
                });
                numList.attr("data-required", "true");
            }
        }
    }

    $(".delete-user").click(function () {
        let userId = $(this).data("id");
        let action = $(this).data("action");

        Swal.fire({
            title: "¿Eliminar usuario?",
            text: "No podrás deshacer esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                $.post(action, { user_id: userId, csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val() }, function (response) {
                    Swal.fire("Eliminado", response.message, "success").then(() => location.reload());
                });
            }
        });
    });
});

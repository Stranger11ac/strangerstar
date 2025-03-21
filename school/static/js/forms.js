$(document).ready(function () {
    $("[data-clearform]").on("click", function () {
        const formId = $(this).data("clearform");
        $(`#${formId}`).trigger("reset");
    });

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
                numList.attr("data-required", "false");
            }
        }
    }

    $(document).on("click", "[data-getuser]", function () {
        const $userAction = $("#usersTable").data("getuser-url");
        const $userId = $(this).data("getuser");

        $.post($userAction, {
            user_id: $userId,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        })
            .done(function (response) {
                $("#upUser").text(response.username);
                $("#up_user_id").val($userId);

                $("#up_first_name").val(response.first_name);
                $("#up_last_name").val(response.last_name);
                $("#up_username").val(response.username);
                $("#up_email").val(response.email);
                $("#up_insignia").val(response.insignia);
                $("#up_num_list").val(response.num_list);

                $("#up_uid").val(response.uid);
                $("#up_uid_text").text(response.uid);

                const valueRol = response.rol;
                $(`#up_rol option[selected]`).removeAttr("selected");
                $(`#up_rol option[value='${valueRol}']`).attr("selected", "selected");

                const $distintive = $("[data-validupuser] #user_distintive");
                const $numListGroup = $("[data-validupuser] #user_distintive #num_list_group");
                const $insignia = $("[data-validupuser] #up_insignia");
                const $numList = $("[data-validupuser] #up_num_list");

                toggleStudentInputs(valueRol, $distintive, $numListGroup, $insignia, $numList);
            })
            .fail(function (xhr) {
                message = xhr.responseJSON?.error || "No se pudo obtener la información del usuario.";
                toast("center", 8000, "error", message);
            });
    });

    $(document).on("click", "[data-deluser]", function () {
        const dataBtn = $(this).data("deluser").split("-");
        const $userId = dataBtn[0];
        const $actionDel = dataBtn[1];
        const usernameGet = $(`#row-user_${$userId} .username`).text().replace(/\n/g, "").trim();

        Swal.fire({
            title: `¿Eliminar a ${usernameGet}?`,
            text: "No podrás deshacer esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                $.post($actionDel, {
                    user_id: $userId,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
                })
                    .done(function (response) {
                        $(`#row-user_${$userId}`).remove();
                        toast("top", 8000, "success", response.message);
                    })
                    .fail(function (xhr) {
                        message = xhr.responseJSON?.error || "No se pudo obtener la información del usuario.";
                        toast("center", 8000, "error", message);
                    });
            }
        });
    });

    $(document).on("click", "[data-actuser]", function () {
        const $btn = $(this);
        const dataBtn = $btn.attr("data-actuser").split("-");
        const $userId = dataBtn[0];
        const $userAction = dataBtn[1];
        let $userActive = dataBtn[2] === "true";

        $.post($userAction, {
            user_id: $userId,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
            is_active: $userActive,
        })
            .done(function (response) {
                toast("bottom", 4000, "success", response.message);
                $userActive = !$userActive;
                $btn.attr("data-actuser", `${$userId}-${$userAction}-${$userActive}`);

                if (!$userActive) {
                    $btn.attr("title", "Desactivar usuario");
                    $(`#row-user_${$userId} .username div`).removeClass("radius orange")
                    $btn.find("span").addClass("sleeping-circle-bold-duotone").removeClass("emoji-funny-circle-bold-duotone");
                } else {
                    $btn.attr("title", "Activar usuario");
                    $(`#row-user_${$userId} .username div`).addClass("radius orange")
                    $btn.find("span").addClass("emoji-funny-circle-bold-duotone").removeClass("sleeping-circle-bold-duotone");
                }
            })
            .fail(function (xhr) {
                const message = xhr.responseJSON?.error || "No se pudo obtener la información del usuario.";
                toast("center", 8000, "error", message);
            });
    });
});

$(document).ready(function () {
    $("[data-validuser] #rol").on("change", function () {
        const valueRol = $(this).val();
        if (valueRol == "admin") {
            $("[data-validuser] #user_distintive").slideUp();
            $("[data-validuser] #insignia").attr("data-required", "false");
            $("[data-validuser] #num_list").attr("data-required", "false");

        } else if (valueRol == "student") {
            $("[data-validuser] #user_distintive").slideDown();
            $("[data-validuser] #user_distintive #num_list_group").slideDown("fast");
            $("[data-validuser] #insignia").attr("placeholder", "Grupo:");
            $("[data-validuser] #insignia").attr("data-indications", "Escribe al menos 2 letras: 1A, 1B, 2A, 3Ctm, 3Ctv");
            $("[data-validuser] #insignia").attr("data-required", "true");
            $("[data-validuser] #num_list").attr("data-required", "true");

        } else if (valueRol == "professor") {
            $("[data-validuser] #user_distintive").slideDown();
            $("[data-validuser] #user_distintive #num_list_group").slideUp("fast");
            $("[data-validuser] #insignia").attr("placeholder", "Titulo Profesional:");
            $("[data-validuser] #insignia").attr("data-indications", "Escribe la contraccion del titulo: Ing., Lic., Mtro., Dr...");
            $("[data-validuser] #insignia").attr("data-required", "true");
            $("[data-validuser] #num_list").attr("data-required", "true");
        }
    });
});

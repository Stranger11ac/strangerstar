$(document).ready(function () {
    var typingTimer;
    function setupDelayedValidation(selector) {
        $(selector)
            .find("input")
            .each(function () {
                $(this)
                    .on("keyup", function () {
                        clearTimeout(typingTimer);
                        var element = this;
                        typingTimer = setTimeout(function () {
                            $(element).valid();
                            validAllInputs(selector);
                        }, 900);
                    })
                    .on("keydown", function () {
                        clearTimeout(typingTimer);
                    });
            });
    }

    function validAllInputs(formSelector) {
        var allValid = $(formSelector)
            .find(".validate input")
            .toArray()
            .every(function (input) {
                return $(input).hasClass("is-valid");
            });

        if (allValid) {
            $("[type='submit']").removeClass("opacity").removeAttr("disabled");
        } else {
            $("[type='submit']").addClass("opacity").attr("disabled", "disabled");
        }
    }

    // Métodos personalizados de validación
    $.validator.addMethod("validname", function (value, element) {
        return this.optional(element) || expressions.name.test(value);
    });
    $.validator.addMethod("validusername", function (value, element) {
        return this.optional(element) || expressions.username.test(value);
    });
    $.validator.addMethod("validemail", function (value, element) {
        return this.optional(element) || expressions.email.test(value);
    });
    $.validator.addMethod("validpassword", function (value, element) {
        return this.optional(element) || expressions.password.test(value);
    });
    $.validator.addMethod("validnumber", function (value, element) {
        return this.optional(element) || expressions.number.test(value);
    });

    function createValidation(selector, rules, messages, optionals) {
        try {
            $(selector).validate({
                ignore: optionals ? optionals : ":hidden",
                rules: rules,
                messages: messages,
                validClass: "is-valid",
                errorClass: "is-invalid",
                errorPlacement: function (error, element) {
                    error.addClass("error_text");
                    error.insertAfter(element);
                },
                invalidHandler: function (event, validator) {
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ? "Llena correctamente el campo resaltado 😬" : "Corrige los " + errors + " errores resaltados 😥😯🧐🤔😬";
                        toast("center", 10000, "error", message);
                    }
                },
                submitHandler: function () {
                    $(`${selector} input`).blur();
                    setTimeout(() => {
                        $(`${selector} input`).removeClass("is-invalid is-valid");
                        $(".error_text").remove();
                    }, 1000);
                },
            });
            setupDelayedValidation(selector);
        } catch (error) {
            console.error("Error Inesperado: ", error);
            toast("center", 8000, "error", `😥 Ah ocurrido un error #304.`);
        }
    }

    // Reglas y mensajes comunes
    var commonRules = {
        first_name: { required: true, minlength: 3, validname: true },
        last_name: { required: true, minlength: 5, validname: true },
        username: { required: false, minlength: 5, validusername: true },
        email: { required: false, validemail: true, email: true },
    };

    var commonMessages = {
        first_name: {
            required: "Ingresa un nombre.",
            validname: "Escribe palabras sin caracteres especiales (!@#$%^&:)",
            minlength: "El nombre debe tener al menos 3 letras.",
        },
        last_name: {
            required: "Ingresa los apellidos.",
            validname: "Escribe palabras sin caracteres especiales (!@#$%^&:)",
            minlength: "Escribe al menos 5 letras.",
        },
        username: {
            validusername: "El nombre de usuario debe contener solo letras, numeros y guiones. No puede comenzar por numeros o guiones.",
            minlength: "Escribe al menos 5 letras.",
        },
        email: {
            validemail: "Ingresa un correo electrónico válido...",
            email: "Ingresa un correo electrónico válido",
        },
    };

    // Validación para el formulario de crear usuario
    createValidation(
        "[data-validuser]",
        {
            ...commonRules,
            rol: { required: true },
            insignia: {
                required: function () {
                    const isRequired = $("[data-validuser] #insignia").attr("data-required") === "true";
                    return isRequired;
                },
                minlength: 2,
            },
            num_list: {
                required: function () {
                    const isRequired = $("[data-validuser] #num_list").attr("data-required") === "true";
                    return isRequired;
                },
                minlength: 1,
                validnumber: true,
            },
        },
        {
            ...commonMessages,
            rol: { required: "Selecciona un rol." },
            insignia: {
                required: "Este campo es obligatorio, Escribe al menos 2 letras.",
                minlength: function () {
                    const indications = $("[data-validuser] #insignia").attr("data-indications");
                    return indications ? indications : "Escribe al menos 2 letras.";
                },
            },
            num_list: {
                required: "Completa este campo.",
                minlength: "Escribe al menos 1 número.",
                validnumber: "Escribe solo números.",
            },
        }
    );
});

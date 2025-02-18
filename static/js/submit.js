$(document).ready(function () {
    $("[data-submit]").on("submit", jsonSubmit);

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
            $("[type='submit']").removeClass("none").removeAttr("disabled");
        } else {
            $("[type='submit']").addClass("none").attr("disabled", "disabled");
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
    $.validator.addMethod("validtitle", function (value, element) {
        return this.optional(element) || expressions.title.test(value);
    });

    function createValidation(selector, rules, messages, gapMsg = false, optionals) {
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
                unhighlight: function (element) {
                    $(element).addClass("is-valid").removeClass("is-invalid");
                    validAllInputs(selector);
                },
                submitHandler: function (e, form) {
                    e.preventDefault();
                    jsonSubmit({
                        target: form,
                        formUrl: $(`${selector}[data-action]`),
                        preventDefault: function () {},
                    });
                },
            });
            setupDelayedValidation(`${selector} input`);
        } catch (error) {
            console.error("Error Inesperado: ", error);
            toast("center", 8000, "error", `😥 Ah ocurrido un error #304.`);
        }
    }

    // Reglas y mensajes comunes
    var commonRules = {
        first_name: { required: true, minlength: 3, validname: true },
        last_name: { required: true, minlength: 5, validname: true },
        username: { required: true, minlength: 5, validusername: true },
        email: { required: true, validemail: true, email: true },
    };

    var commonMessages = {
        first_name: {
            required: "Ingresa tu nombre.",
            validname: "Escribe palabras sin caracteres especiales (!@#$%^&:)",
            minlength: "Tu nombre debe tener al menos 3 letras.",
        },
        last_name: {
            required: "Ingresa tus apellidos.",
            validname: "Escribe palabras sin caracteres especiales (!@#$%^&:)",
            minlength: "Escribe al menos 5 letras.",
        },
        username: {
            required: "Ingresa un nombre de usuario.",
            validusername: "El nombre de usuario debe contener solo letras, numeros y guiones. No puede comenzar por numeros o guiones.",
            minlength: "Escribe al menos 5 letras.",
        },
        email: {
            required: "Ingresa tu correo electrónico.",
            validemail: "Ingresa un correo electrónico válido",
            email: "Ingresa un correo electrónico válido",
        },
    };

    // Validación para el formulario de crear usuario
    createValidation(
        "[data-valid-user]",
        {
            ...commonRules,
            password1: { required: true, minlength: 8, validpassword: true },
        },
        {
            ...commonMessages,
            password1: {
                required: "Ingresa una contraseña.",
                validpassword:
                    "La contraseña debe tener al menos: <ul class='m-0'><li>8 caracteres</li><li>1 letra mayúscula</li><li>1 letra minúscula</li><li>1 número <li>1 carácter especial (!@#$%)</li><li>No puede contener guiones</li></ul>",
                minlength: "Tu contraseña debe tener al menos 8 caracteres.",
            },
        }
    );
});

function jsonSubmit(e, formUrl = none) {
    e.preventDefault();

    const $form = $(this);
    const formData = new FormData(this);
    const csrfToken = $("[name=csrfmiddlewaretoken]").val();
    let $formUrl = $form.attr("action");

    const $submitButton = $form.find('button[type="submit"]');
    if ($submitButton.length) {
        $submitButton.prop("disabled", true);
    } else {
        console.warn("Advertencia: Botón de envío no encontrado...");
    }

    if (!$formUrl) {
        $formUrl = formUrl;
    }

    $.ajax({
        url: $formUrl,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrfToken,
        },
        success: function (data) {
            const dataMsg = data.message;

            if (data.datastatus) {
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else {
                    toast("top", 8000, "success", dataMsg);
                }
            } else {
                toast("center", 8000, "error", dataMsg);
            }
        },
        error: function (jqXHR) {
            const response = jqXHR.responseJSON;
            const msg = response?.message || "Error desconocido";
            toast("center", 8000, "error", msg);

            if (!response?.message) {
                console.error(response || "Error desconocido");
            }
        },
        complete: function () {
            if ($submitButton.length) {
                $submitButton.prop("disabled", false);
            }
        },
    });
}

$(document).ready(function () {
    $("[data-submit], [data-valid-user]").on("submit", jsonSubmit);
});

function jsonSubmit(event) {
    event.preventDefault();

    const $form = $(this);
    const formData = new FormData(this);
    const $csrfToken = $("[name=csrfmiddlewaretoken]").val();
    const $formUrlAct = $form.attr("action");

    const $submitButton = $form.find('button[type="submit"]');
    if ($submitButton.length) {
        $submitButton.prop("disabled", true);
    } else {
        console.warn("Advertencia: Botón de envío no encontrado...");
    }

    $.ajax({
        url: $formUrlAct,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": $csrfToken,
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
            $form.trigger("reset");
        },
        error: function (jqXHR) {
            const response = jqXHR.responseJSON;
            const msg = response?.message || "Error desconocido";
            toast("center", 8000, "error", msg);

            if (!response?.message) {
                console.error(response || "Error desconocido");
            }

            if (response?.valSelector) {
                $(`#${response.valSelector}`).focus();
            }
        },
        complete: function () {
            if ($submitButton.length) {
                $submitButton.prop("disabled", false);
            }
        },
    });
}

$(document).ready(function () {
    $("[data-submit]").submit(function (e) {
        e.preventDefault = e.preventDefault || function () {};
        e.preventDefault();

        const thisForm = e.target;
        const formData = new FormData(thisForm);
        const formToken = $("[name=csrfmiddlewaretoken]").val();

        try {
            formSubmitBtn = thisForm.querySelector('button[type="submit"]');
            if (formSubmitBtn) {
                formSubmitBtn.setAttribute("disabled", "disabled");
            }
        } catch (error) {
            console.warn("Advertencia: Boton de envio no encontrado...");
            console.warn(formSubmitBtn);
            console.error(error);
        }

        fetch(thisForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": formToken,
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.json();
                    console.error(data);
                    throw new Error(data.error || "Error en el formato recivido");
                }
                return response.json();
            })
            .then((data) => {
                const datastatus = data.datastatus;
                const dataMsg = data.message;
                let dataIcon;
                if (datastatus) {
                    dataIcon = "success";
                } else {
                    dataIcon = "error";
                }

                toast("center", 8000, dataIcon, dataMsg);
            });
    });
});

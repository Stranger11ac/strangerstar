$(document).ready(function () {
    
    $("#btnNotificacion").click(function () {
        const imageThis = $(this).attr("data-image");

        if (!("Notification" in window)) {
            toast('center', 8000, 'info', 'Tu navegador no soporta notificaciones.');
            return;
        }

        if (Notification.permission === "granted") {
            new Notification("Nuevo Evento Registrado", {
                body: "Se creo un nuevo evento. Examenes de la clase Programacion asignado para todos.",
                icon: imageThis,
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("Nuevo Evento Registrado", {
                        body: "Se creo un nuevo evento. Examenes de la clase Programacion asignado para todos.",
                        icon: imageThis,
                    });
                }
            });
        }
    });
});

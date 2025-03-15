// Transfered About Content #############################################
const contProfile = $("#contAbout").html();
$("#tabAbout").html(contProfile);

// Save Toggle Aside ##########################################################
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        $("#close_aside").click();
    }
});
$("#close_aside").click(() => {
    const status = $("aside").hasClass("close") ? "open" : "close";
    $("aside").css({
        "--box-height": "",
        "--img-size": "",
    });
    localStorage.setItem("aside-status", status);
});

const asideStatus = localStorage.getItem("aside-status");
if (asideStatus && asideStatus === "open") {
    $("aside#userAside").removeClass("close");
} else {
    $("aside#userAside").addClass("close");
}

// Scroll in Aside #####################################################
$("[data-listening]").each(function () {
    const $dataListenScroll = $(this);
    const $dataListenVal = $dataListenScroll.attr("data-listening");
    let $listenScroll = $dataListenScroll.find(".listen_scroll");
    let $boxStyle;

    const initialHeight = 11;
    const minBoxHeight = 6;
    let boxHeight = initialHeight;

    const initialImgSize = 18;
    const minImgSize = 8;
    let imgSize = initialImgSize;

    $listenScroll.on("scroll", function () {
        let scrollPos = $listenScroll.scrollTop(); // Obtiene el desplazamiento actual
        let factor = Math.min(scrollPos / 100, 1); // Rango de 0 a 1
        boxHeight = initialHeight - (initialHeight - minBoxHeight) * factor;
        imgSize = initialImgSize - (initialImgSize - minImgSize) * factor;

        if ($dataListenVal == "scroll") {
            $boxStyle = $dataListenScroll;
        } else {
            $boxStyle = $listenScroll;
        }
        $boxStyle.css({
            "--box-height": `clamp(80px, ${boxHeight}vw, 150px)`,
            "--img-size": `clamp(160px, ${imgSize}vw, 260px)`,
        });
    });
});

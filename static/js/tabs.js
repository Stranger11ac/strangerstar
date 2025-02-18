// URL Hash Changes ######################################################################
function updateActiveTab() {
    const currentHash = window.location.hash.substring(1);
    const isWideScreen = $(window).width() > 1023;
    const $containerTabs = $("#containerTabs");

    $("[data-toggle-tab]").removeClass("link_active");
    $("[data-tab]").removeClass("active");

    let activeHash = currentHash === "tabAbout" && isWideScreen ? false : currentHash;
    const $tabCurrent = $(`[data-tab="${activeHash}"]`);

    if (activeHash) {
        $(`[data-toggle-tab="${activeHash}"]`).addClass("link_active");
        $containerTabs.removeClass("transparent");
        $tabCurrent.addClass("active");

        if (activeHash === "tabHome") {
            $containerTabs.removeClass("tabAbout");
            if ($containerTabs.hasClass("has_swiper")) {
                swiper.autoplay.start();
            }
        } else {
            if ($containerTabs.hasClass("has_swiper")) {
                swiper.autoplay.stop();
            }
        }

        if ($tabCurrent.hasClass("will_transparent")) {
            $containerTabs.addClass("transparent");
        }
    } else if ($("body").hasClass("update_link")) {
        $('[data-tab="tabHome"]').addClass("active");
        $('[data-toggle-tab="tabHome"]').addClass("link_active");
        $containerTabs.removeClass("tabAbout");
    }
}

// URL Hash changes and Window Size ##########################################
function handleResize() {
    const isWideScreen = $(window).width() > 1023;

    if (isWideScreen && $('[data-toggle-tab="tabAbout"]').hasClass("link_active")) {
        $('[data-toggle-tab="tabAbout"]').removeClass("link_active");
        $('[data-toggle-tab="tabHome"]').addClass("link_active");
        $('[data-tab="tabAbout"]').removeClass("active");
        $('[data-tab="tabHome"]').addClass("active");

        $("#containerTabs").addClass("transparent");
    } else if (!isWideScreen) {
        updateActiveTab();
    }
}

$(window).on("hashchange", updateActiveTab);
$(window).on("resize", handleResize).trigger("resize");
updateActiveTab();
